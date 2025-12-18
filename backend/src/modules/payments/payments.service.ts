import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { MonthlyContribution } from '../monthly-contributions/entities/monthly-contribution.entity';
import { AnnualContribution } from '../annual-contributions/entities/annual-contribution.entity';
import { MonthlyContributionsService } from '../monthly-contributions/monthly-contributions.service';
import { AnnualContributionsService } from '../annual-contributions/annual-contributions.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(MonthlyContribution)
    private readonly monthlyContributionRepo: Repository<MonthlyContribution>,
    @InjectRepository(AnnualContribution)
    private readonly annualContributionRepo: Repository<AnnualContribution>,
    private readonly monthlyContributionsService: MonthlyContributionsService,
    private readonly annualContributionsService: AnnualContributionsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreatePaymentDto): Promise<Payment> {
    const currentYear = new Date().getFullYear();
    
    // Get current year annual contribution for the family
    const annualContribution = await this.annualContributionRepo.findOne({
      where: {
        familyId: createDto.familyId,
        year: currentYear,
      },
      relations: ['monthlyContributions'],
    });

    if (!annualContribution) {
      throw new BadRequestException(
        `No annual contribution found for family ${createDto.familyId} in year ${currentYear}. Please create an annual contribution first.`,
      );
    }

    const monthlyAmount = Number(annualContribution.monthlyAmount);
    const paymentAmount = Number(createDto.amount);

    // Distribute payment to monthly contributions chronologically
    return await this.dataSource.transaction(async (manager) => {
      const payment = manager.create(Payment, {
        ...createDto,
        paymentDate: new Date(createDto.paymentDate),
        status: PaymentStatus.UNDISTRIBUTED,
        distributedAmount: 0,
      });

      const savedPayment = await manager.save(Payment, payment);

      // Get monthly contributions ordered by month (Jan -> Dec)
      const monthlyContributions = await manager.find(MonthlyContribution, {
        where: { annualContributionId: annualContribution.id },
        order: { month: 'ASC' },
      });

      let remainingAmount = paymentAmount;
      let totalDistributed = 0;

      // Distribute chronologically
      for (const monthly of monthlyContributions) {
        if (remainingAmount <= 0) break;

        const currentPaid = Number(monthly.paidAmount);
        const needed = monthlyAmount - currentPaid;

        if (needed > 0) {
          const toDistribute = Math.min(remainingAmount, needed);
          
          monthly.paidAmount = currentPaid + toDistribute;
          await manager.save(MonthlyContribution, monthly);
          
          // Update status
          await this.monthlyContributionsService.updateStatus(monthly.id);

          remainingAmount -= toDistribute;
          totalDistributed += toDistribute;
        }
      }

      // Update payment distributed amount and status
      savedPayment.distributedAmount = totalDistributed;
      if (totalDistributed >= paymentAmount) {
        savedPayment.status = PaymentStatus.DISTRIBUTED;
      } else if (totalDistributed > 0) {
        savedPayment.status = PaymentStatus.PARTIAL;
      }

      await manager.save(Payment, savedPayment);

      // Update annual contribution total paid
      await this.annualContributionsService.updateTotalPaid(annualContribution.id);

      return savedPayment;
    });
  }

  async findAll(familyId?: number, status?: PaymentStatus): Promise<Payment[]> {
    const where: any = {};
    if (familyId) where.familyId = familyId;
    if (status) where.status = status;

    return this.paymentRepo.find({
      where,
      relations: ['family'],
      order: { paymentDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['family'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async getUndistributedPayments(familyId?: number): Promise<Payment[]> {
    const where: any = {
      status: PaymentStatus.UNDISTRIBUTED,
    };
    if (familyId) where.familyId = familyId;

    return this.paymentRepo.find({
      where,
      relations: ['family'],
      order: { paymentDate: 'ASC' },
    });
  }

  async update(id: number, updateDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);

    if (updateDto.paymentDate) {
      payment.paymentDate = new Date(updateDto.paymentDate);
    }

    Object.assign(payment, updateDto);
    return this.paymentRepo.save(payment);
  }

  async updateDistributedAmount(
    id: number,
    distributedAmount: number,
  ): Promise<Payment> {
    const payment = await this.findOne(id);
    const totalAmount = Number(payment.amount);

    if (distributedAmount > totalAmount) {
      throw new BadRequestException(
        'Distributed amount cannot exceed payment amount',
      );
    }

    payment.distributedAmount = distributedAmount;

    // Update status based on distributed amount
    if (distributedAmount === 0) {
      payment.status = PaymentStatus.UNDISTRIBUTED;
    } else if (distributedAmount >= totalAmount) {
      payment.status = PaymentStatus.DISTRIBUTED;
    } else {
      payment.status = PaymentStatus.PARTIAL;
    }

    return this.paymentRepo.save(payment);
  }

  async delete(id: number): Promise<void> {
    const payment = await this.findOne(id);

    // Check if payment has been distributed
    if (payment.distributedAmount > 0) {
      throw new BadRequestException(
        'Cannot delete payment that has been distributed',
      );
    }

    await this.paymentRepo.remove(payment);
  }

  getRemainingAmount(payment: Payment): number {
    return Number(payment.amount) - Number(payment.distributedAmount);
  }
}

