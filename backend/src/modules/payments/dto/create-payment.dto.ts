import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsPositive,
  IsEnum,
  IsDateString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Family ID',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  familyId: number;

  @ApiProperty({
    description: 'User ID who made the payment (primary member or spouse)',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({
    description: 'Payment amount',
    example: 5000,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Date of payment',
    example: '2025-01-15',
  })
  @IsDateString()
  paymentDate: string;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.MPESA,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Payment reference number',
    example: 'MPESA123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({
    description: 'Additional notes about the payment',
    example: 'Payment for January to March',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

