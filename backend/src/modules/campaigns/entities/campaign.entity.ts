import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Contribution } from 'src/modules/contributions/entities/contribution.entity';

export enum CampaignFrequency {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  ONE_OFF = 'ONE_OFF',
  VOLUNTARY = 'VOLUNTARY',
}

@Entity()
export class Campaign {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Welfare Fund 2024' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Monthly contribution for member welfare' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ 
    example: 5000000.00, 
    description: 'Fixed amount required' 
  })
  @Column({ type: 'decimal', precision: 50, scale: 2, nullable: false })
  targetAmount: number;

  @ApiProperty({ 
    example: 500.00, 
    description: 'Single installment amount' 
  })
  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: false })
  installmentAmount: number;

  @ApiProperty({ enum: CampaignFrequency, example: CampaignFrequency.MONTHLY })
  @Column({
    type: 'enum',
    enum: CampaignFrequency,
    default: CampaignFrequency.VOLUNTARY,
  })
  frequency: CampaignFrequency;

  @ApiProperty({ description: 'Is this campaign currently active?' })
  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Contribution, (contribution) => contribution.campaign)
  contributions: Contribution[];
}