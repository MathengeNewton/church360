import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sermons')
export class Sermon {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the sermon', example: 1 })
  id: number;

  @Column()
  @ApiProperty({ description: 'Title of the sermon', example: 'The Power of Faith' })
  title: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Main sermon notes/content',
    example: 'Today we will explore the power of faith and how it transforms our lives...',
  })
  notes: string;

  @Column('text', { array: true, default: [] })
  @ApiProperty({
    description: 'Array of bible verse references',
    example: ['John 3:16', 'Romans 8:28', 'Hebrews 11:1'],
    type: [String],
  })
  bibleVerses: string[];

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    required: false,
    description: 'Stories shared in the sermon',
    example: 'There was a man who faced great adversity...',
  })
  stories: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    required: false,
    description: 'Lessons learned/teachings from the sermon',
    example: '1. Faith requires action\n2. Trust in God\'s timing\n3. Perseverance pays off',
  })
  lessons: string;

  @Column({ type: 'date' })
  @ApiProperty({
    description: 'Date when sermon was delivered',
    example: '2025-01-15',
  })
  sermonDate: Date;

  @Column({ nullable: true })
  @ApiProperty({
    required: false,
    description: 'Name of the preacher',
    example: 'Rev. Peter Kamau',
  })
  preacher: string;

  @Column({ nullable: true })
  @ApiProperty({
    required: false,
    description: 'Location where sermon was delivered',
    example: 'PCEA St. Andrews Nairobi',
  })
  location: string;

  @Column({ default: true })
  @ApiProperty({
    description: 'Whether sermon is published for viewing',
    example: true,
    default: true,
  })
  isPublished: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

