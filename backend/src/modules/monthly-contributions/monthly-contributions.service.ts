import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { MonthlyContribution } from './entities/monthly-contribution.entity';
import { MonthlyContributionStatus } from './entities/monthly-contribution.entity';

@Injectable()
export class MonthlyContributionsService {
  constructor(
    @InjectRepository(MonthlyContribution)
    private readonly monthlyContributionRepo: Repository<MonthlyContribution>,
  ) {}

  async findAll(
    annualContributionId?: number,
    familyId?: number,
  ): Promise<MonthlyContribution[]> {
    const queryBuilder = this.monthlyContributionRepo
      .createQueryBuilder('monthly')
      .leftJoinAndSelect('monthly.annualContribution', 'annual')
      .leftJoinAndSelect('annual.family', 'family');

    if (annualContributionId) {
      queryBuilder.where('monthly.annualContributionId = :annualContributionId', {
        annualContributionId,
      });
    }

    if (familyId) {
      queryBuilder.andWhere('annual.familyId = :familyId', { familyId });
    }

    return queryBuilder
      .orderBy('monthly.year', 'DESC')
      .addOrderBy('monthly.month', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<MonthlyContribution> {
    const monthlyContribution = await this.monthlyContributionRepo.findOne({
      where: { id },
      relations: ['annualContribution', 'annualContribution.family'],
    });

    if (!monthlyContribution) {
      throw new NotFoundException(
        `Monthly contribution with ID ${id} not found`,
      );
    }

    return monthlyContribution;
  }

  async findByAnnualContribution(
    annualContributionId: number,
  ): Promise<MonthlyContribution[]> {
    return this.monthlyContributionRepo.find({
      where: { annualContributionId },
      order: { month: 'ASC' },
    });
  }

  async getOverdueContributions(
    familyId?: number,
  ): Promise<MonthlyContribution[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const queryBuilder = this.monthlyContributionRepo
      .createQueryBuilder('monthly')
      .leftJoinAndSelect('monthly.annualContribution', 'annual')
      .where('monthly.dueDate < :today', { today })
      .andWhere('monthly.status != :paidStatus', {
        paidStatus: MonthlyContributionStatus.PAID,
      });

    if (familyId) {
      queryBuilder.andWhere('annual.familyId = :familyId', { familyId });
    }

    return queryBuilder
      .orderBy('monthly.dueDate', 'ASC')
      .getMany();
  }

  async getPendingContributions(
    familyId?: number,
  ): Promise<MonthlyContribution[]> {
    const queryBuilder = this.monthlyContributionRepo
      .createQueryBuilder('monthly')
      .leftJoinAndSelect('monthly.annualContribution', 'annual')
      .where('monthly.status = :status', {
        status: MonthlyContributionStatus.PENDING,
      });

    if (familyId) {
      queryBuilder.andWhere('annual.familyId = :familyId', { familyId });
    }

    return queryBuilder
      .orderBy('monthly.dueDate', 'ASC')
      .getMany();
  }

  async updatePaidAmount(
    id: number,
    amount: number,
  ): Promise<MonthlyContribution> {
    const monthlyContribution = await this.findOne(id);
    const newPaidAmount = Number(monthlyContribution.paidAmount) + amount;
    const expectedAmount = Number(monthlyContribution.expectedAmount);

    // Update status based on paid amount
    let status = monthlyContribution.status;
    if (newPaidAmount >= expectedAmount) {
      status = MonthlyContributionStatus.PAID;
      monthlyContribution.paidDate = new Date();
    } else if (newPaidAmount > 0) {
      status = MonthlyContributionStatus.PARTIAL;
    }

    // Check if overdue
    const today = new Date();
    if (
      monthlyContribution.dueDate < today &&
      status !== MonthlyContributionStatus.PAID
    ) {
      status = MonthlyContributionStatus.OVERDUE;
    }

    monthlyContribution.paidAmount = newPaidAmount;
    monthlyContribution.status = status;

    return this.monthlyContributionRepo.save(monthlyContribution);
  }

  async updateStatus(id: number): Promise<MonthlyContribution> {
    const monthlyContribution = await this.findOne(id);
    const paidAmount = Number(monthlyContribution.paidAmount);
    const expectedAmount = Number(monthlyContribution.expectedAmount);
    const today = new Date();

    let status = monthlyContribution.status;

    if (paidAmount >= expectedAmount) {
      status = MonthlyContributionStatus.PAID;
      if (!monthlyContribution.paidDate) {
        monthlyContribution.paidDate = new Date();
      }
    } else if (paidAmount > 0) {
      status = MonthlyContributionStatus.PARTIAL;
    } else {
      status = MonthlyContributionStatus.PENDING;
    }

    // Check if overdue
    if (
      monthlyContribution.dueDate < today &&
      status !== MonthlyContributionStatus.PAID
    ) {
      status = MonthlyContributionStatus.OVERDUE;
    }

    monthlyContribution.status = status;
    return this.monthlyContributionRepo.save(monthlyContribution);
  }
}

