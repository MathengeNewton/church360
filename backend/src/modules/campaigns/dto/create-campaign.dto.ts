import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DistributionItemDto {
  @ApiProperty({
    description: 'Monthly Contribution ID',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  monthlyContributionId: number;

  @ApiProperty({
    description: 'Amount to distribute to this monthly contribution',
    example: 1000,
  })
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;
}

export class CreateCampaignDto {
  @ApiProperty({
    description: 'Campaign name',
    example: 'January Distribution',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Campaign description',
    example: 'Distribution of payment to monthly contributions',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Payment ID being distributed',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  paymentId: number;

  @ApiProperty({
    description: 'Family ID',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  familyId: number;

  @ApiProperty({
    description: 'Distribution items - which monthly contributions to distribute to',
    type: [DistributionItemDto],
    example: [
      { monthlyContributionId: 1, amount: 1000 },
      { monthlyContributionId: 2, amount: 1000 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DistributionItemDto)
  distributions: DistributionItemDto[];
}

