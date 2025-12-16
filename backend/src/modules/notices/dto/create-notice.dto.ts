import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsInt,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { NoticeType, NoticePriority, TargetAudience } from '../entities/notice.entity';

export class CreateNoticeDto {
  @ApiProperty({
    description: 'Title of the notice',
    example: 'Monthly Welfare Meeting',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Content of the notice',
    example: 'The monthly welfare meeting will be held on...',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Type of notice',
    enum: NoticeType,
    example: NoticeType.ANNOUNCEMENT,
    required: false,
  })
  @IsOptional()
  @IsEnum(NoticeType)
  type?: NoticeType;

  @ApiProperty({
    description: 'Priority level',
    enum: NoticePriority,
    example: NoticePriority.MEDIUM,
    required: false,
  })
  @IsOptional()
  @IsEnum(NoticePriority)
  priority?: NoticePriority;

  @ApiProperty({
    description: 'Target audience',
    enum: TargetAudience,
    example: TargetAudience.ALL,
    required: false,
  })
  @IsOptional()
  @IsEnum(TargetAudience)
  targetAudience?: TargetAudience;

  @ApiProperty({
    description: 'Array of family IDs if target is specific',
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  targetFamilyIds?: number[];

  @ApiProperty({
    description: 'Date when notice expires',
    example: '2025-02-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiProperty({
    description: 'Whether the notice is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

