import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '../../payments/entities/payment.entity';
import { Family } from '../../family/entities/family.entity';
import { CampaignDistribution } from './campaign-distribution.entity';

export enum CampaignStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

@Entity('campaigns')
export class Campaign {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Campaign name', example: 'January Distribution' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Campaign description',
    example: 'Distribution of payment to monthly contributions',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Payment ID being distributed', example: 1 })
  @Column()
  paymentId: number;

  @ApiProperty({ description: 'Family ID', example: 1 })
  @Column()
  familyId: number;

  @ApiProperty({
    description: 'Date when distribution was made',
    example: '2025-01-15T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  distributionDate: Date;

  @ApiProperty({
    description: 'Total amount distributed in this campaign',
    example: 3000,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalDistributed: number;

  @ApiProperty({
    description: 'Status of the campaign',
    enum: CampaignStatus,
    example: CampaignStatus.COMPLETED,
  })
  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.PENDING,
  })
  status: CampaignStatus;

  @ApiProperty({
    description: 'Date when the campaign was created',
    example: '2025-01-15T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the campaign was last updated',
    example: '2025-01-15T00:00:00.000Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Payment, (payment) => payment.campaigns)
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @ManyToOne(() => Family)
  @JoinColumn({ name: 'familyId' })
  family: Family;

  @OneToMany(
    () => CampaignDistribution,
    (campaignDistribution) => campaignDistribution.campaign,
  )
  distributions: CampaignDistribution[];
}

