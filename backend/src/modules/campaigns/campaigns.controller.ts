import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../roles/entities/role.entity';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { DistributePaymentDto } from './dto/distribute-payment.dto';

@ApiTags('Campaigns')
@ApiBearerAuth()
@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Create a new campaign (manual distribution)' })
  async create(@Body() createDto: CreateCampaignDto) {
    return this.campaignsService.create(createDto);
  }

  @Post('auto-distribute')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Auto-distribute a payment to oldest unpaid months' })
  async autoDistribute(@Body() distributeDto: DistributePaymentDto) {
    return this.campaignsService.autoDistributePayment(distributeDto.paymentId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get all campaigns' })
  async findAll(
    @Query('familyId') familyId?: string,
    @Query('paymentId') paymentId?: string,
  ) {
    return this.campaignsService.findAll(
      familyId ? parseInt(familyId) : undefined,
      paymentId ? parseInt(paymentId) : undefined,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get a single campaign by ID' })
  async findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(+id);
  }

  @Post(':id/undo')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Undo a campaign distribution' })
  async undoDistribution(@Param('id') id: string) {
    await this.campaignsService.undoDistribution(+id);
    return { message: 'Campaign distribution undone successfully' };
  }
}

