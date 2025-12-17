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
import { SermonsService } from './sermons.service';
import { Sermon } from './entities/sermon.entity';
import { CreateSermonDto } from './dto/create-sermon.dto';
import { UpdateSermonDto } from './dto/update-sermon.dto';

@ApiTags('Sermons')
@ApiBearerAuth()
@Controller('sermons')
@UseGuards(JwtAuthGuard)
export class SermonsController {
  constructor(private readonly sermonsService: SermonsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new sermon' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createDto: CreateSermonDto): Promise<Sermon> {
    return this.sermonsService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get all sermons with optional filters' })
  @ApiQuery({ name: 'published', required: false, type: Boolean, description: 'Filter by published status' })
  @ApiQuery({ name: 'preacher', required: false, type: String, description: 'Filter by preacher name' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Filter sermons from this date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Filter sermons until this date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in title, notes, or preacher' })
  async findAll(
    @Query('published') published?: string,
    @Query('preacher') preacher?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') search?: string,
  ): Promise<Sermon[]> {
    const filters: any = {};
    
    if (published !== undefined) {
      filters.published = published === 'true';
    }
    
    if (preacher) {
      filters.preacher = preacher;
    }
    
    if (startDate) {
      filters.startDate = startDate;
    }
    
    if (endDate) {
      filters.endDate = endDate;
    }
    
    if (search) {
      filters.search = search;
    }

    return this.sermonsService.findAll(Object.keys(filters).length > 0 ? filters : undefined);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get a sermon by ID' })
  async findOne(@Param('id') id: string): Promise<Sermon> {
    return this.sermonsService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a sermon by ID' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSermonDto,
  ): Promise<Sermon> {
    return this.sermonsService.update(+id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a sermon by ID' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.sermonsService.remove(+id);
  }

  @Post(':id/publish')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Publish a sermon' })
  async publish(@Param('id') id: string): Promise<Sermon> {
    return this.sermonsService.publish(+id);
  }

  @Post(':id/unpublish')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Unpublish a sermon' })
  async unpublish(@Param('id') id: string): Promise<Sermon> {
    return this.sermonsService.unpublish(+id);
  }
}

