import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateAnnualContributionDto {
  @ApiProperty({
    description: 'Family ID',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  familyId: number;

  @ApiProperty({
    description: 'Year of contribution',
    example: 2025,
  })
  @IsInt()
  @Min(2000)
  year: number;

  @ApiProperty({
    description: 'Total annual contribution amount',
    example: 12000,
  })
  @IsNumber()
  @IsPositive()
  annualAmount: number;

  @ApiProperty({
    description: 'Amount carried over from previous year',
    example: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  carriedOverAmount?: number;
}

