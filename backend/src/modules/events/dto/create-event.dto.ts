import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsEmail,
  MinLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventType, EventStatus } from '../entities/event.entity';

class EventMetadataDto {
  @ApiProperty({ required: false, example: ['Opening Prayer', 'Main Session'] })
  @IsOptional()
  agenda?: string[];

  @ApiProperty({ required: false, example: ['Rev. John Doe', 'Rev. Jane Smith'] })
  @IsOptional()
  speakers?: string[];

  @ApiProperty({ required: false, example: 'https://example.com/resources' })
  @IsOptional()
  @IsString()
  resourcesUrl?: string;

  @ApiProperty({ required: false, example: { dressCode: 'Formal', parking: 'Available' } })
  @IsOptional()
  additionalInfo?: Record<string, any>;
}

export class CreateEventDto {
  @ApiProperty({ description: 'Title of the event', example: 'Annual General Meeting' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Description of the event',
    example: 'Join us for our Annual General Meeting...',
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({
    description: 'Type of event',
    enum: EventType,
    example: EventType.MEETING,
    default: EventType.OTHER,
  })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @ApiProperty({
    description: 'Start date and time of the event',
    example: '2025-02-15T10:00:00Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date and time of the event',
    example: '2025-02-15T14:00:00Z',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    required: false,
    description: 'Location of the event',
    example: 'PCEA St. Andrews Nairobi - Main Hall',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    required: false,
    description: 'Status of the event',
    enum: EventStatus,
    example: EventStatus.DRAFT,
    default: EventStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiProperty({
    required: false,
    description: 'Contact person for the event',
    example: 'Rev. Peter Kamau',
  })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiProperty({
    required: false,
    description: 'Contact phone number',
    example: '+254712345678',
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({
    required: false,
    description: 'Contact email',
    example: 'events@pceachurch.or.ke',
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiProperty({
    required: false,
    description: 'Maximum number of attendees',
    example: 500,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttendees?: number;

  @ApiProperty({
    required: false,
    description: 'Whether registration is required',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  requiresRegistration?: boolean;

  @ApiProperty({
    required: false,
    description: 'Whether event is visible to mobile app',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isMobileAppVisible?: boolean;

  @ApiProperty({
    required: false,
    description: 'Additional metadata',
    type: EventMetadataDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EventMetadataDto)
  metadata?: EventMetadataDto;
}

