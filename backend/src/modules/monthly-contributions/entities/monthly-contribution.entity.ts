import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AnnualContribution } from '../../annual-contributions/entities/annual-contribution.entity';

export enum MonthlyContributionStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

@Entity('monthly_contributions')
export class MonthlyContribution {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Annual Contribution ID', example: 1 })
  @Column()
  annualContributionId: number;

  @ApiProperty({ description: 'Month number (1-12)', example: 1 })
  @Column({ type: 'int' })
  month: number;

  @ApiProperty({ description: 'Year', example: 2025 })
  @Column({ type: 'int' })
  year: number;

  @ApiProperty({
    description: 'Expected amount for this month',
    example: 1000,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  expectedAmount: number;

  @ApiProperty({
    description: 'Amount paid so far for this month',
    example: 0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @ApiProperty({
    description: 'Status of the monthly contribution',
    enum: MonthlyContributionStatus,
    example: MonthlyContributionStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: MonthlyContributionStatus,
    default: MonthlyContributionStatus.PENDING,
  })
  status: MonthlyContributionStatus;

  @ApiProperty({
    description: 'Due date for this month',
    example: '2025-01-31T00:00:00.000Z',
  })
  @Column({ type: 'date' })
  dueDate: Date;

  @ApiProperty({
    description: 'Date when this month was fully paid',
    example: '2025-01-15T00:00:00.000Z',
    required: false,
  })
  @Column({ type: 'date', nullable: true })
  paidDate: Date | null;

  @ApiProperty({
    description: 'Date when the monthly contribution was created',
    example: '2025-01-01T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the monthly contribution was last updated',
    example: '2025-01-01T00:00:00.000Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relationships
  @ManyToOne(
    () => AnnualContribution,
    (annualContribution) => annualContribution.monthlyContributions,
  )
  @JoinColumn({ name: 'annualContributionId' })
  annualContribution: AnnualContribution;
}

