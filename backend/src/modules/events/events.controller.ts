import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../roles/entities/role.entity';
import { EventStatus } from './entities/event.entity';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new event (admin only)' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createDto: CreateEventDto) {
    return this.eventsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events with optional filters' })
  @ApiQuery({ name: 'status', required: false, enum: EventStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by type' })
  @ApiQuery({ name: 'upcoming', required: false, type: Boolean, description: 'Get only upcoming events' })
  @ApiQuery({ name: 'mobileAppVisible', required: false, type: Boolean, description: 'Get only mobile app visible events' })
  @ApiQuery({ name: 'search', required: false, description: 'Search in title, description, location' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter events starting from this date' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter events ending before this date' })
  async findAll(
    @Query('status') status?: EventStatus,
    @Query('type') type?: string,
    @Query('upcoming') upcoming?: string,
    @Query('mobileAppVisible') mobileAppVisible?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (upcoming === 'true') filters.upcoming = true;
    if (mobileAppVisible === 'true') filters.mobileAppVisible = true;
    if (search) filters.search = search;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    return this.eventsService.findAll(filters);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming published events' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of results' })
  async getUpcoming(@Query('limit') limit?: number) {
    return this.eventsService.getUpcoming(limit ? +limit : undefined);
  }

  @Get('mobile')
  @ApiOperation({ summary: 'Get mobile app visible events' })
  async getMobileAppVisible() {
    return this.eventsService.getMobileAppVisible();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  async findOne(@Param('id') id: number) {
    return this.eventsService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an event (admin only)' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: number, @Body() updateDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an event (admin only)' })
  async remove(@Param('id') id: number) {
    await this.eventsService.remove(+id);
    return { message: 'Event deleted successfully' };
  }

  @Post(':id/publish')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Publish an event (admin only)' })
  async publish(@Param('id') id: number) {
    return this.eventsService.publish(+id);
  }

  @Post(':id/cancel')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel an event (admin only)' })
  async cancel(@Param('id') id: number) {
    return this.eventsService.cancel(+id);
  }
}



