import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum PaymentMethod {
  CASH = 'CASH',
  MPESA = 'MPESA',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity()
export class Payment {
  @ApiProperty({ description: 'Unique identifier for the payment', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The user who made the payment' })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Amount paid', example: 1500.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Method of payment',
    enum: PaymentMethod,
    example: PaymentMethod.MPESA,
  })
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  method: PaymentMethod;

  @ApiProperty({
    description: 'Current status of the payment',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
    default: PaymentStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @ApiProperty({
    description: 'M-Pesa Transaction Code (e.g., QGH12345)',
    required: false,
    example: 'QGH5678XZ',
  })
  @Column({ nullable: true, unique: true })
  mpesaCode: string;

  @ApiProperty({
    description: 'Phone number used for payment',
    required: false,
    example: '254712345678',
  })
  @Column({ nullable: true })
  phoneNumber: string;

  @ApiProperty({
    description: 'M-Pesa Checkout Request ID (for STK Push)',
    required: false,
  })
  @Column({ nullable: true })
  merchantRequestId: string;

  @ApiProperty({
    description: 'Name of the person who received the cash',
    required: false,
  })
  @Column({ nullable: true })
  receivedBy: string;

  @ApiProperty({
    description: 'Optional reference or receipt number for cash',
    required: false,
  })
  @Column({ nullable: true })
  receiptNumber: string;

  @ApiProperty({ description: 'Date when payment was initiated' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when payment record was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
