import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async create(createDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepo.create({
      ...createDto,
      paymentDate: new Date(createDto.paymentDate),
      status: PaymentStatus.UNDISTRIBUTED,
      distributedAmount: 0,
    });

    // Calculate remaining amount (same as amount initially)
    return this.paymentRepo.save(payment);
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
      relations: ['family', 'campaigns'],
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

