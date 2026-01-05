import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';

export class BulkCreateAnnualContributionDto {
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
}

