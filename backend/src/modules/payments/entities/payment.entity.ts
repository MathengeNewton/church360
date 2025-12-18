import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Family } from '../../family/entities/family.entity';

export enum PaymentMethod {
  CASH = 'cash',
  MPESA = 'mpesa',
  BANK = 'bank',
  CHEQUE = 'cheque',
}

export enum PaymentStatus {
  UNDISTRIBUTED = 'undistributed',
  DISTRIBUTED = 'distributed',
  PARTIAL = 'partial',
}

@Entity('payments')
export class Payment {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Family ID', example: 1 })
  @Column()
  familyId: number;

  @ApiProperty({ description: 'User ID who made the payment', example: 1 })
  @Column()
  userId: number;

  @ApiProperty({
    description: 'Payment amount',
    example: 5000,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Date of payment',
    example: '2025-01-15T00:00:00.000Z',
  })
  @Column({ type: 'date' })
  paymentDate: Date;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.MPESA,
  })
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Payment reference number',
    example: 'MPESA123456',
    required: false,
  })
  @Column({ nullable: true })
  reference: string;

  @ApiProperty({
    description: 'Status of the payment',
    enum: PaymentStatus,
    example: PaymentStatus.UNDISTRIBUTED,
  })
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNDISTRIBUTED,
  })
  status: PaymentStatus;

  @ApiProperty({
    description: 'Amount that has been distributed to monthly contributions',
    example: 0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  distributedAmount: number;

  // Computed property: remainingAmount = amount - distributedAmount
  // This will be calculated in the service layer

  @ApiProperty({
    description: 'Additional notes about the payment',
    example: 'Payment for January to March',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({
    description: 'Date when the payment was created',
    example: '2025-01-15T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the payment was last updated',
    example: '2025-01-15T00:00:00.000Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Family)
  @JoinColumn({ name: 'familyId' })
  family: Family;
}

