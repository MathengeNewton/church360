// districts.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { DistrictsService } from './districts.service';
import { District } from './entities/district.entity';
import { UserRole } from '../roles/entities/role.entity';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { AssignLeadersDto } from './dto/assign-leaders.dto';
import { User } from '../users/entities/user.entity';

@ApiTags('Districts')
@ApiBearerAuth()
@Controller('districts')
@UseGuards(JwtAuthGuard)
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get all districts' })
  async findAll(): Promise<District[]> {
    return this.districtsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get a single district by ID' })
  async findOne(@Param('id') id: string): Promise<District> {
    return this.districtsService.findOne(+id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new district' })
  async create(@Body() createDto: CreateDistrictDto): Promise<District> {
    return this.districtsService.create(createDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a district by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDistrictDto,
  ): Promise<District> {
    return this.districtsService.update(+id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a district by ID' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.districtsService.delete(+id);
  }

  // District Leadership Endpoints
  @Post(':id/assign-leaders')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign one or multiple users as district leaders' })
  async assignLeaders(
    @Param('id') id: string,
    @Body() assignLeadersDto: AssignLeadersDto,
  ): Promise<District> {
    return this.districtsService.assignLeaders(+id, assignLeadersDto.userIds);
  }

  @Get(':id/leaders')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get all leaders of a district' })
  async getLeaders(@Param('id') id: string): Promise<User[]> {
    return this.districtsService.getLeaders(+id);
  }

  @Post(':id/remove-leader/:userId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove a user from district leaders' })
  async removeLeader(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<District> {
    return this.districtsService.removeLeader(+id, +userId);
  }

  @Get(':id/members')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get all members of a district' })
  async getMembers(@Param('id') id: string): Promise<User[]> {
    return this.districtsService.getMembers(+id);
  }
}

