import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Family } from './family.entity';
import { User } from '../../users/entities/user.entity';

export enum FamilyMemberRole {
  PRIMARY_MEMBER = 'PRIMARY_MEMBER',
  SPOUSE = 'SPOUSE',
  OFFSPRING = 'OFFSPRING',
}

@Entity('family_members')
@Unique(['familyId', 'userId'])
export class FamilyMember {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Family ID', example: 1 })
  @Column()
  familyId: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  @Column()
  userId: number;

  @ApiProperty({
    description: 'Role in the family',
    enum: FamilyMemberRole,
    example: FamilyMemberRole.PRIMARY_MEMBER,
  })
  @Column({
    type: 'enum',
    enum: FamilyMemberRole,
  })
  role: FamilyMemberRole;

  @ApiProperty({
    description: 'Relationship description',
    example: 'father',
    required: false,
  })
  @Column({ nullable: true })
  relationship: string;

  @ApiProperty({ description: 'Family entity' })
  @ManyToOne(() => Family, (family) => family.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'familyId' })
  family: Family;

  @ApiProperty({ description: 'User entity' })
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

