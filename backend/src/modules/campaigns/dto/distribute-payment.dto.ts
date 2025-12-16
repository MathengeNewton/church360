import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class DistributePaymentDto {
  @ApiProperty({
    description: 'Payment ID to distribute',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  paymentId: number;

  @ApiProperty({
    description: 'Whether to auto-distribute to oldest unpaid months',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  autoDistribute?: boolean;
}

