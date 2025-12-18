import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Family } from '../../family/entities/family.entity';
import { MonthlyContribution } from '../../monthly-contributions/entities/monthly-contribution.entity';

export enum AnnualContributionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CARRIED_OVER = 'carried_over',
}

@Entity('annual_contributions')
export class AnnualContribution {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Family ID', example: 1 })
  @Column()
  familyId: number;

  @ApiProperty({ description: 'Year of contribution', example: 2025 })
  @Column({ type: 'int' })
  year: number;

  @ApiProperty({
    description: 'Total annual contribution amount',
    example: 12000,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  annualAmount: number;

  @ApiProperty({
    description: 'Monthly contribution amount (annualAmount / 12)',
    example: 1000,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlyAmount: number;

  @ApiProperty({
    description: 'Status of the annual contribution',
    enum: AnnualContributionStatus,
    example: AnnualContributionStatus.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: AnnualContributionStatus,
    default: AnnualContributionStatus.ACTIVE,
  })
  status: AnnualContributionStatus;

  @ApiProperty({
    description: 'Amount carried over from previous year',
    example: 0,
    required: false,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  carriedOverAmount: number;

  @ApiProperty({
    description: 'Total amount paid so far',
    example: 0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPaid: number;

  @ApiProperty({
    description: 'Date when the annual contribution was created',
    example: '2025-01-01T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the annual contribution was last updated',
    example: '2025-01-01T00:00:00.000Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Family, (family) => family.annualContributions)
  @JoinColumn({ name: 'familyId' })
  family: Family;

  @OneToMany(
    () => MonthlyContribution,
    (monthlyContribution) => monthlyContribution.annualContribution,
  )
  monthlyContributions: MonthlyContribution[];
}

