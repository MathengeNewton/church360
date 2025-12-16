import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Family {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of the family', example: 'Smith' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Address of the family',
    example: '123 Main St, Springfield',
    required: false,
  })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({
    description: 'Generations of the family members',
    example: 3,
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  generations: number;

  @ApiProperty({ description: 'Family Head' })
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'headId' })
  head: User;

  @ApiProperty({
    description: 'Date when the family was added to the system',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the family was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relationships
  @OneToMany(
    () => require('../../annual-contributions/entities/annual-contribution.entity').AnnualContribution,
    (annualContribution: any) => annualContribution.family,
  )
  annualContributions: any[];

  @OneToMany(
    () => require('../../payments/entities/payment.entity').Payment,
    (payment: any) => payment.family,
  )
  payments: any[];
}
