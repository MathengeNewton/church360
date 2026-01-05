import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum EventType {
  WORSHIP = 'worship',
  MEETING = 'meeting',
  FELLOWSHIP = 'fellowship',
  OUTREACH = 'outreach',
  TRAINING = 'training',
  CONFERENCE = 'conference',
  OTHER = 'other',
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the event', example: 1 })
  id: number;

  @Column()
  @ApiProperty({ description: 'Title of the event', example: 'Annual General Meeting' })
  title: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Description of the event',
    example: 'Join us for our Annual General Meeting where we will discuss church matters and elect new leaders.',
  })
  description: string;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.OTHER,
  })
  @ApiProperty({
    description: 'Type of event',
    enum: EventType,
    example: EventType.MEETING,
    default: EventType.OTHER,
  })
  type: EventType;

  @Column({ type: 'timestamp' })
  @ApiProperty({
    description: 'Start date and time of the event',
    example: '2025-02-15T10:00:00Z',
  })
  startDate: Date;

  @Column({ type: 'timestamp' })
  @ApiProperty({
    description: 'End date and time of the event',
    example: '2025-02-15T14:00:00Z',
  })
  endDate: Date;

  @Column({ nullable: true })
  @ApiProperty({
    required: false,
    description: 'Location of the event',
    example: 'PCEA St. Andrews Nairobi - Main Hall',
  })
  location: string;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  @ApiProperty({
    description: 'Status of the event',
    enum: EventStatus,
    example: EventStatus.PUBLISHED,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;

  @Column({ nullable: true })
  @ApiProperty({
    required: false,
    description: 'Contact person for the event',
    example: 'Rev. Peter Kamau',
  })
  contactPerson: string;

  @Column({ nullable: true })
  @ApiProperty({
    required: false,
    description: 'Contact phone number',
    example: '+254712345678',
  })
  contactPhone: string;

  @Column({ nullable: true })
  @ApiProperty({
    required: false,
    description: 'Contact email',
    example: 'events@pceachurch.or.ke',
  })
  contactEmail: string;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({
    required: false,
    description: 'Maximum number of attendees',
    example: 500,
  })
  maxAttendees: number;

  @Column({ default: false })
  @ApiProperty({
    description: 'Whether registration is required',
    example: false,
    default: false,
  })
  requiresRegistration: boolean;

  @Column({ default: false })
  @ApiProperty({
    description: 'Whether event is visible to mobile app',
    example: true,
    default: false,
  })
  isMobileAppVisible: boolean;

  @Column({ type: 'json', nullable: true })
  @ApiProperty({
    required: false,
    description: 'Additional metadata (e.g., agenda, speakers, resources)',
    example: { agenda: ['Opening Prayer', 'Main Session', 'Closing'], speakers: ['Rev. John Doe'] },
  })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}


