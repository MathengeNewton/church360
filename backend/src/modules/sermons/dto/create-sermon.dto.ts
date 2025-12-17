import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsArray, IsBoolean, MinLength } from 'class-validator';

export class CreateSermonDto {
  @ApiProperty({ description: 'Title of the sermon', example: 'The Power of Faith' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Main sermon notes/content',
    example: 'Today we will explore the power of faith and how it transforms our lives...',
  })
  @IsString()
  @MinLength(10)
  notes: string;

  @ApiProperty({
    required: false,
    description: 'Array of bible verse references',
    example: ['John 3:16', 'Romans 8:28'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bibleVerses?: string[];

  @ApiProperty({
    required: false,
    description: 'Stories shared in the sermon',
    example: 'There was a man who faced great adversity...',
  })
  @IsOptional()
  @IsString()
  stories?: string;

  @ApiProperty({
    required: false,
    description: 'Lessons learned/teachings from the sermon',
    example: '1. Faith requires action\n2. Trust in God\'s timing',
  })
  @IsOptional()
  @IsString()
  lessons?: string;

  @ApiProperty({
    description: 'Date when sermon was delivered',
    example: '2025-01-15',
  })
  @IsDateString()
  sermonDate: string;

  @ApiProperty({
    required: false,
    description: 'Name of the preacher',
    example: 'Rev. Peter Kamau',
  })
  @IsOptional()
  @IsString()
  preacher?: string;

  @ApiProperty({
    required: false,
    description: 'Location where sermon was delivered',
    example: 'PCEA St. Andrews Nairobi',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    required: false,
    description: 'Whether sermon is published for viewing',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

