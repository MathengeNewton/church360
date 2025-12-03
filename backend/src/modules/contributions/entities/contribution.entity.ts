import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/entities/user.entity';
import { Campaign } from 'src/modules/campaigns/entities/campaign.entity';
import { Payment } from 'src/modules/payments/entities/payments.entity';

@Entity()
export class Contribution {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The amount allocated to this specific contribution' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'The Member making the contribution' })
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'The Campaign (e.g., Welfare) this belongs to' })
  @ManyToOne(() => Campaign, (campaign) => campaign.contributions, { eager: true })
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @ApiProperty({ description: 'The Payment transaction that covered this contribution' })
  @ManyToOne(() => Payment, { nullable: true })
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @ApiProperty({ 
    description: 'The month this contribution covers (1-12). Null for one-off gifts.', 
    example: 11 
  })
  @Column({ type: 'int', nullable: true })
  forMonth: number;

  @ApiProperty({ 
    description: 'The year this contribution covers.', 
    example: 2023 
  })
  @Column({ type: 'int', nullable: true })
  forYear: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}