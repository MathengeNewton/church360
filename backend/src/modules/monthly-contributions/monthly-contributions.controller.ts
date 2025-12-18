import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../roles/entities/role.entity';
import { MonthlyContributionsService } from './monthly-contributions.service';

@ApiTags('Monthly Contributions')
@ApiBearerAuth()
@Controller('monthly-contributions')
@UseGuards(JwtAuthGuard)
export class MonthlyContributionsController {
  constructor(
    private readonly monthlyContributionsService: MonthlyContributionsService,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get all monthly contributions' })
  async findAll(
    @Query('annualContributionId') annualContributionId?: string,
    @Query('familyId') familyId?: string,
  ) {
    return this.monthlyContributionsService.findAll(
      annualContributionId ? parseInt(annualContributionId) : undefined,
      familyId ? parseInt(familyId) : undefined,
    );
  }

  @Get('overdue')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get overdue monthly contributions' })
  async getOverdue(@Query('familyId') familyId?: string) {
    return this.monthlyContributionsService.getOverdueContributions(
      familyId ? parseInt(familyId) : undefined,
    );
  }

  @Get('pending')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get pending monthly contributions' })
  async getPending(@Query('familyId') familyId?: string) {
    return this.monthlyContributionsService.getPendingContributions(
      familyId ? parseInt(familyId) : undefined,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get a single monthly contribution by ID' })
  async findOne(@Param('id') id: string) {
    return this.monthlyContributionsService.findOne(+id);
  }
}

