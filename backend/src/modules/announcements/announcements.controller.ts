import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../roles/entities/role.entity';
import { AnnouncementsService } from './announcements.service';
import { Announcement, AnnouncementType, AnnouncementPriority } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@ApiTags('Announcements')
@ApiBearerAuth()
@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new announcement' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createDto: CreateAnnouncementDto): Promise<Announcement> {
    return this.announcementsService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get all announcements with optional filters' })
  @ApiQuery({ name: 'type', required: false, enum: AnnouncementType, description: 'Filter by type' })
  @ApiQuery({ name: 'priority', required: false, enum: AnnouncementPriority, description: 'Filter by priority' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'isMobileAppVisible', required: false, type: Boolean, description: 'Filter by mobile app visibility' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in title or content' })
  async findAll(
    @Query('type') type?: AnnouncementType,
    @Query('priority') priority?: AnnouncementPriority,
    @Query('isActive') isActive?: string,
    @Query('isMobileAppVisible') isMobileAppVisible?: string,
    @Query('search') search?: string,
  ): Promise<Announcement[]> {
    const filters: any = {};

    if (type) {
      filters.type = type;
    }

    if (priority) {
      filters.priority = priority;
    }

    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }

    if (isMobileAppVisible !== undefined) {
      filters.isMobileAppVisible = isMobileAppVisible === 'true';
    }

    if (search) {
      filters.search = search;
    }

    return this.announcementsService.findAll(Object.keys(filters).length > 0 ? filters : undefined);
  }

  @Get('active')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get all active announcements' })
  async findActive(): Promise<Announcement[]> {
    return this.announcementsService.findActive();
  }

  @Get('mobile')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get all mobile app visible announcements' })
  async findMobileAppVisible(): Promise<Announcement[]> {
    return this.announcementsService.findMobileAppVisible();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get an announcement by ID' })
  async findOne(@Param('id') id: string): Promise<Announcement> {
    return this.announcementsService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an announcement by ID' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    return this.announcementsService.update(+id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an announcement by ID' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.announcementsService.remove(+id);
  }

  @Post(':id/publish')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Publish an announcement' })
  async publish(@Param('id') id: string): Promise<Announcement> {
    return this.announcementsService.publish(+id);
  }

  @Post(':id/expire')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Expire an announcement' })
  async expire(@Param('id') id: string): Promise<Announcement> {
    return this.announcementsService.expire(+id);
  }
}

