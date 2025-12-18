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
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@ApiTags('Notices')
@ApiBearerAuth()
@Controller('notices')
@UseGuards(JwtAuthGuard)
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new notice' })
  async create(@Body() createDto: CreateNoticeDto) {
    return this.noticesService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get all notices' })
  async findAll(
    @Query('familyId') familyId?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.noticesService.findAll(
      familyId ? parseInt(familyId) : undefined,
      isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    );
  }

  @Get('active')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get active notices' })
  async findActive(@Query('familyId') familyId?: string) {
    return this.noticesService.findActiveNotices(
      familyId ? parseInt(familyId) : undefined,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.FIELD_AGENT)
  @ApiOperation({ summary: 'Get a single notice by ID' })
  async findOne(@Param('id') id: string) {
    return this.noticesService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a notice by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNoticeDto,
  ) {
    return this.noticesService.update(+id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a notice by ID' })
  async delete(@Param('id') id: string) {
    await this.noticesService.delete(+id);
    return { message: 'Notice deleted successfully' };
  }

  @Post(':id/publish')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Publish a notice' })
  async publish(@Param('id') id: string) {
    return this.noticesService.publish(+id);
  }

  @Post(':id/expire')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Expire a notice' })
  async expire(@Param('id') id: string) {
    return this.noticesService.expire(+id);
  }
}

