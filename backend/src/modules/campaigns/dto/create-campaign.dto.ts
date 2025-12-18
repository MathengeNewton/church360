import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsPositive,
} from 'class-validator';
import { CampaignFrequency } from '../entities/campaign.entity';

export class CreateCampaignDto {
  @ApiProperty({
    example: 'Welfare Fund 2024',
    description: 'Name of the campaign',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Monthly contribution for member welfare',
    description: 'Detailed description of what the campaign is for',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 5000000.00,
    description: 'The total target amount required for the campaign',
  })
  @IsNumber()
  @IsPositive()
  targetAmount: number;

  @ApiProperty({
    example: 500.00,
    description: 'The amount a member is expected to pay per installment',
  })
  @IsNumber()
  @IsPositive()
  installmentAmount: number;

  @ApiProperty({
    enum: CampaignFrequency,
    example: CampaignFrequency.MONTHLY,
    description: 'How often the contribution should be made',
    default: CampaignFrequency.VOLUNTARY,
  })
  @IsEnum(CampaignFrequency)
  @IsOptional()
  frequency?: CampaignFrequency;

  @ApiProperty({
    example: true,
    description: 'Whether the campaign is currently accepting contributions',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}