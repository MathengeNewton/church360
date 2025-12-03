import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../entities/payments.entity';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID of the user making the payment', example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Amount paid', example: 1000.0 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.MPESA })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
    default: PaymentStatus.COMPLETED,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiProperty({ description: 'Required if method is MPESA', required: false })
  @ValidateIf((o: CreatePaymentDto) => o.method === PaymentMethod.MPESA)
  @IsString()
  mpesaCode?: string;

  @ApiProperty({ description: 'Required if method is MPESA', required: false })
  @ValidateIf((o: CreatePaymentDto) => o.method === PaymentMethod.MPESA)
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: 'Person receiving the cash', required: false })
  @ValidateIf((o: CreatePaymentDto) => o.method === PaymentMethod.CASH)
  @IsString()
  receivedBy?: string;

  @ApiProperty({ description: 'Receipt number if available', required: false })
  @IsOptional()
  @IsString()
  receiptNumber?: string;
}
