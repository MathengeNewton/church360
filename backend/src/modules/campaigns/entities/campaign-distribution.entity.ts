import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Campaign } from './campaign.entity';
import { MonthlyContribution } from '../../monthly-contributions/entities/monthly-contribution.entity';

@Entity('campaign_distributions')
export class CampaignDistribution {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Campaign ID', example: 1 })
  @Column()
  campaignId: number;

  @ApiProperty({ description: 'Monthly Contribution ID', example: 1 })
  @Column()
  monthlyContributionId: number;

  @ApiProperty({
    description: 'Amount distributed to this monthly contribution',
    example: 1000,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Date when the distribution was created',
    example: '2025-01-15T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => Campaign, (campaign) => campaign.distributions)
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @ManyToOne(
    () => MonthlyContribution,
    (monthlyContribution) => monthlyContribution.campaignDistributions,
  )
  @JoinColumn({ name: 'monthlyContributionId' })
  monthlyContribution: MonthlyContribution;
}

