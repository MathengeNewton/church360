import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum NoticeType {
  ANNOUNCEMENT = 'announcement',
  NOTICE = 'notice',
  REMINDER = 'reminder',
}

export enum NoticePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TargetAudience {
  ALL = 'all',
  FAMILIES = 'families',
  SPECIFIC = 'specific',
}

@Entity('notices')
export class Notice {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Title of the notice',
    example: 'Monthly Welfare Meeting',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Content of the notice',
    example: 'The monthly welfare meeting will be held on...',
  })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({
    description: 'Type of notice',
    enum: NoticeType,
    example: NoticeType.ANNOUNCEMENT,
  })
  @Column({
    type: 'enum',
    enum: NoticeType,
    default: NoticeType.NOTICE,
  })
  type: NoticeType;

  @ApiProperty({
    description: 'Priority level',
    enum: NoticePriority,
    example: NoticePriority.MEDIUM,
  })
  @Column({
    type: 'enum',
    enum: NoticePriority,
    default: NoticePriority.MEDIUM,
  })
  priority: NoticePriority;

  @ApiProperty({
    description: 'Target audience',
    enum: TargetAudience,
    example: TargetAudience.ALL,
  })
  @Column({
    type: 'enum',
    enum: TargetAudience,
    default: TargetAudience.ALL,
  })
  targetAudience: TargetAudience;

  @ApiProperty({
    description: 'Array of family IDs if target is specific',
    example: [1, 2, 3],
    required: false,
  })
  @Column('int', { array: true, nullable: true })
  targetFamilyIds: number[] | null;

  @ApiProperty({
    description: 'Date when notice was published',
    example: '2025-01-15T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @ApiProperty({
    description: 'Date when notice expires',
    example: '2025-02-15T00:00:00.000Z',
    required: false,
  })
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @ApiProperty({
    description: 'Whether the notice is active',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Date when the notice was created',
    example: '2025-01-15T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the notice was last updated',
    example: '2025-01-15T00:00:00.000Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

