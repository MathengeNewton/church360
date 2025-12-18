import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../roles/entities/role.entity';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus } from './entities/payment.entity';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Create a new payment' })
  async create(@Body() createDto: CreatePaymentDto) {
    return this.paymentsService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get all payments' })
  async findAll(
    @Query('familyId') familyId?: string,
    @Query('status') status?: PaymentStatus,
  ) {
    return this.paymentsService.findAll(
      familyId ? parseInt(familyId) : undefined,
      status,
    );
  }

  @Get('undistributed')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get undistributed payments' })
  async getUndistributed(@Query('familyId') familyId?: string) {
    return this.paymentsService.getUndistributedPayments(
      familyId ? parseInt(familyId) : undefined,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get a single payment by ID' })
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a payment by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(+id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a payment by ID' })
  async delete(@Param('id') id: string) {
    await this.paymentsService.delete(+id);
    return { message: 'Payment deleted successfully' };
  }
}

