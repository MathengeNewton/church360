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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../roles/entities/role.entity';
import { AnnualContributionsService } from './annual-contributions.service';
import { CreateAnnualContributionDto } from './dto/create-annual-contribution.dto';
import { UpdateAnnualContributionDto } from './dto/update-annual-contribution.dto';
import { BulkCreateAnnualContributionDto } from './dto/bulk-create-annual-contribution.dto';

@ApiTags('Annual Contributions')
@ApiBearerAuth()
@Controller('annual-contributions')
@UseGuards(JwtAuthGuard)
export class AnnualContributionsController {
  constructor(
    private readonly annualContributionsService: AnnualContributionsService,
  ) {}

  @Post('bulk-create')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create annual contributions for all families for a year' })
  async bulkCreate(
    @Body() bulkCreateDto: BulkCreateAnnualContributionDto,
  ) {
    return this.annualContributionsService.createBulkForAllFamilies(
      bulkCreateDto.year,
      bulkCreateDto.annualAmount,
    );
  }

  @Post('carryover')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Carry over debt from one year to another' })
  async carryOver(
    @Body()
    body: {
      familyId: number;
      fromYear: number;
      toYear: number;
    },
  ) {
    return this.annualContributionsService.carryOverDebt(
      body.familyId,
      body.fromYear,
      body.toYear,
    );
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new annual contribution' })
  async create(@Body() createDto: CreateAnnualContributionDto) {
    return this.annualContributionsService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get all annual contributions' })
  async findAll(@Query('familyId') familyId?: string) {
    return this.annualContributionsService.findAll(
      familyId ? parseInt(familyId) : undefined,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get a single annual contribution by ID' })
  async findOne(@Param('id') id: string) {
    return this.annualContributionsService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an annual contribution by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAnnualContributionDto,
  ) {
    return this.annualContributionsService.update(+id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an annual contribution by ID' })
  async delete(@Param('id') id: string) {
    await this.annualContributionsService.delete(+id);
    return { message: 'Annual contribution deleted successfully' };
  }
}

