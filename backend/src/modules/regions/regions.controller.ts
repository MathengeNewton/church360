// regions.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RegionsService } from './regions.service';
import { Region } from './entities/region.entity';
import { UserRole } from '../roles/entities/role.entity';

@ApiTags('Region')
@ApiBearerAuth()
@Controller('regions')
@UseGuards(JwtAuthGuard)
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get all regions' })
  async findAll(): Promise<Region[]> {
    return this.regionsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get a single region by ID' })
  async findOne(@Param('id') id: string): Promise<Region> {
    return this.regionsService.findOne(+id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new region' })
  async create(@Body() region: Region): Promise<Region> {
    return this.regionsService.create(region);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a region by ID' })
  async update(
    @Param('id') id: string,
    @Body() region: Region,
  ): Promise<Region> {
    return this.regionsService.update(+id, region);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a region by ID' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.regionsService.delete(+id);
  }
}