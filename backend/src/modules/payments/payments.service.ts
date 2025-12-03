import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod } from './entities/payments.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    // 1. Verify User exists
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    // 2. If M-Pesa, check for duplicate Transaction Code
    if (dto.method === PaymentMethod.MPESA) {
      if (!dto.mpesaCode) {
        throw new BadRequestException(
          'M-Pesa Code is required for M-Pesa payments',
        );
      }
      const existing = await this.paymentRepo.findOne({
        where: { mpesaCode: dto.mpesaCode },
      });
      if (existing) {
        throw new BadRequestException(
          `Payment with M-Pesa code ${dto.mpesaCode} already exists`,
        );
      }
    }

    // 3. Create Payment
    const payment = this.paymentRepo.create({
      ...dto,
      user: user, // Link the user entity
    });

    return await this.paymentRepo.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}
