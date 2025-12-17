import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
  MinLength,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AnnouncementType, AnnouncementPriority } from '../entities/announcement.entity';

class AnnouncementMetadataDto {
  @ApiProperty({ required: false, example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ required: false, example: '2025-12-25T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @ApiProperty({ required: false, example: 'PCEA St. Andrews Nairobi' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false, example: 'Rev. Peter Kamau' })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiProperty({ required: false, example: '+254712345678' })
  @IsOptional()
  @IsString()
  contactPhone?: string;
}

export class CreateAnnouncementDto {
  @ApiProperty({ description: 'Title of the announcement', example: 'Annual General Meeting' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Content of the announcement',
    example: 'The Annual General Meeting will be held on December 25th...',
  })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiProperty({
    description: 'Type of announcement',
    enum: AnnouncementType,
    example: AnnouncementType.EVENT,
    default: AnnouncementType.GENERAL,
  })
  @IsOptional()
  @IsEnum(AnnouncementType)
  type?: AnnouncementType;

  @ApiProperty({
    description: 'Priority level',
    enum: AnnouncementPriority,
    example: AnnouncementPriority.HIGH,
    default: AnnouncementPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(AnnouncementPriority)
  priority?: AnnouncementPriority;

  @ApiProperty({
    required: false,
    description: 'Date when announcement expires',
    example: '2025-02-15T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiProperty({
    required: false,
    description: 'Whether announcement is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    required: false,
    description: 'Flag for mobile app consumption',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isMobileAppVisible?: boolean;

  @ApiProperty({
    required: false,
    description: 'Additional metadata',
    type: AnnouncementMetadataDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AnnouncementMetadataDto)
  metadata?: AnnouncementMetadataDto;
}

