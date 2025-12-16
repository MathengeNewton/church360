import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnualContribution } from './entities/annual-contribution.entity';
import { MonthlyContribution } from '../monthly-contributions/entities/monthly-contribution.entity';
import { CreateAnnualContributionDto } from './dto/create-annual-contribution.dto';
import { UpdateAnnualContributionDto } from './dto/update-annual-contribution.dto';
import { AnnualContributionStatus } from './entities/annual-contribution.entity';
import { MonthlyContributionStatus } from '../monthly-contributions/entities/monthly-contribution.entity';

@Injectable()
export class AnnualContributionsService {
  constructor(
    @InjectRepository(AnnualContribution)
    private readonly annualContributionRepo: Repository<AnnualContribution>,
    @InjectRepository(MonthlyContribution)
    private readonly monthlyContributionRepo: Repository<MonthlyContribution>,
  ) {}

  async create(
    createDto: CreateAnnualContributionDto,
  ): Promise<AnnualContribution> {
    // Check if annual contribution already exists for this family and year
    const existing = await this.annualContributionRepo.findOne({
      where: {
        familyId: createDto.familyId,
        year: createDto.year,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Annual contribution already exists for family ${createDto.familyId} in year ${createDto.year}`,
      );
    }

    const carriedOverAmount = createDto.carriedOverAmount || 0;
    const totalAnnualAmount = createDto.annualAmount + carriedOverAmount;
    const monthlyAmount = totalAnnualAmount / 12;

    // Create annual contribution
    const annualContribution = this.annualContributionRepo.create({
      familyId: createDto.familyId,
      year: createDto.year,
      annualAmount: createDto.annualAmount,
      monthlyAmount: monthlyAmount,
      carriedOverAmount: carriedOverAmount,
      status: AnnualContributionStatus.ACTIVE,
    });

    const savedAnnual = await this.annualContributionRepo.save(
      annualContribution,
    );

    // Auto-generate 12 monthly contributions
    const monthlyContributions: MonthlyContribution[] = [];
    for (let month = 1; month <= 12; month++) {
      const dueDate = new Date(createDto.year, month - 1, 1);
      // Set due date to last day of the month
      dueDate.setMonth(month);
      dueDate.setDate(0);

      const monthlyContribution = this.monthlyContributionRepo.create({
        annualContributionId: savedAnnual.id,
        month: month,
        year: createDto.year,
        expectedAmount: monthlyAmount,
        paidAmount: 0,
        status: MonthlyContributionStatus.PENDING,
        dueDate: dueDate,
      });

      monthlyContributions.push(monthlyContribution);
    }

    await this.monthlyContributionRepo.save(monthlyContributions);

    return this.findOne(savedAnnual.id);
  }

  async findAll(familyId?: number): Promise<AnnualContribution[]> {
    const where = familyId ? { familyId } : {};
    return this.annualContributionRepo.find({
      where,
      relations: ['family', 'monthlyContributions'],
      order: { year: 'DESC' },
    });
  }

  async findOne(id: number): Promise<AnnualContribution> {
    const annualContribution = await this.annualContributionRepo.findOne({
      where: { id },
      relations: ['family', 'monthlyContributions'],
    });

    if (!annualContribution) {
      throw new NotFoundException(
        `Annual contribution with ID ${id} not found`,
      );
    }

    return annualContribution;
  }

  async findByFamilyAndYear(
    familyId: number,
    year: number,
  ): Promise<AnnualContribution | null> {
    return this.annualContributionRepo.findOne({
      where: { familyId, year },
      relations: ['family', 'monthlyContributions'],
    });
  }

  async update(
    id: number,
    updateDto: UpdateAnnualContributionDto,
  ): Promise<AnnualContribution> {
    const annualContribution = await this.findOne(id);

    if (updateDto.annualAmount) {
      const monthlyAmount = updateDto.annualAmount / 12;
      annualContribution.annualAmount = updateDto.annualAmount;
      annualContribution.monthlyAmount = monthlyAmount;

      // Update expected amounts for all monthly contributions
      const monthlyContributions = await this.monthlyContributionRepo.find({
        where: { annualContributionId: id },
      });

      for (const monthly of monthlyContributions) {
        monthly.expectedAmount = monthlyAmount;
        await this.monthlyContributionRepo.save(monthly);
      }
    }

    Object.assign(annualContribution, updateDto);
    return this.annualContributionRepo.save(annualContribution);
  }

  async delete(id: number): Promise<void> {
    const annualContribution = await this.findOne(id);
    await this.annualContributionRepo.remove(annualContribution);
  }

  async carryOverDebt(
    familyId: number,
    fromYear: number,
    toYear: number,
  ): Promise<AnnualContribution> {
    // Get the old annual contribution
    const oldContribution = await this.findByFamilyAndYear(familyId, fromYear);
    if (!oldContribution) {
      throw new NotFoundException(
        `No annual contribution found for family ${familyId} in year ${fromYear}`,
      );
    }

    // Calculate unpaid amount
    const totalExpected = oldContribution.annualAmount;
    const unpaidAmount = totalExpected - oldContribution.totalPaid;

    if (unpaidAmount <= 0) {
      throw new BadRequestException('No debt to carry over');
    }

    // Mark old contribution as carried over
    oldContribution.status = AnnualContributionStatus.CARRIED_OVER;
    await this.annualContributionRepo.save(oldContribution);

    // Create new annual contribution with carryover
    const createDto: CreateAnnualContributionDto = {
      familyId,
      year: toYear,
      annualAmount: 0, // Will be set by user or default
      carriedOverAmount: unpaidAmount,
    };

    // If there's already a contribution for the new year, update it
    const existingNew = await this.findByFamilyAndYear(familyId, toYear);
    if (existingNew) {
      existingNew.carriedOverAmount = unpaidAmount;
      return this.annualContributionRepo.save(existingNew);
    }

    return this.create(createDto);
  }

  async updateTotalPaid(annualContributionId: number): Promise<void> {
    const monthlyContributions = await this.monthlyContributionRepo.find({
      where: { annualContributionId },
    });

    const totalPaid = monthlyContributions.reduce(
      (sum, monthly) => sum + Number(monthly.paidAmount),
      0,
    );

    await this.annualContributionRepo.update(annualContributionId, {
      totalPaid: totalPaid,
    });
  }
}

