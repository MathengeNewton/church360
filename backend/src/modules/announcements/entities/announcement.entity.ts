import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum AnnouncementType {
  GENERAL = 'general',
  EVENT = 'event',
  PRAYER = 'prayer',
  MINISTRY = 'ministry',
}

export enum AnnouncementPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the announcement', example: 1 })
  id: number;

  @Column()
  @ApiProperty({ description: 'Title of the announcement', example: 'Annual General Meeting' })
  title: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Content of the announcement',
    example: 'The Annual General Meeting will be held on December 25th at 10:00 AM...',
  })
  content: string;

  @Column({
    type: 'enum',
    enum: AnnouncementType,
    default: AnnouncementType.GENERAL,
  })
  @ApiProperty({
    description: 'Type of announcement',
    enum: AnnouncementType,
    example: AnnouncementType.EVENT,
    default: AnnouncementType.GENERAL,
  })
  type: AnnouncementType;

  @Column({
    type: 'enum',
    enum: AnnouncementPriority,
    default: AnnouncementPriority.MEDIUM,
  })
  @ApiProperty({
    description: 'Priority level of the announcement',
    enum: AnnouncementPriority,
    example: AnnouncementPriority.HIGH,
    default: AnnouncementPriority.MEDIUM,
  })
  priority: AnnouncementPriority;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({
    required: false,
    description: 'Date when announcement was published',
    example: '2025-01-15T09:00:00Z',
  })
  publishedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({
    required: false,
    description: 'Date when announcement expires',
    example: '2025-02-15T23:59:59Z',
  })
  expiresAt: Date;

  @Column({ default: true })
  @ApiProperty({
    description: 'Whether the announcement is currently active',
    example: true,
    default: true,
  })
  isActive: boolean;

  @Column({ default: false })
  @ApiProperty({
    description: 'Flag for mobile app consumption',
    example: false,
    default: false,
  })
  isMobileAppVisible: boolean;

  @Column({ type: 'json', nullable: true })
  @ApiProperty({
    required: false,
    description: 'Additional metadata (imageUrl, eventDate, location, contactPerson, contactPhone)',
    example: {
      imageUrl: 'https://example.com/image.jpg',
      eventDate: '2025-12-25T10:00:00Z',
      location: 'PCEA St. Andrews Nairobi',
      contactPerson: 'Rev. Peter Kamau',
      contactPhone: '+254712345678',
    },
  })
  metadata: {
    imageUrl?: string;
    eventDate?: Date;
    location?: string;
    contactPerson?: string;
    contactPhone?: string;
  };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

