import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
// We assume your UserRole enum is exported from this file, as per your template's structure
import { UserRole } from '../roles/entities/role.entity';

@ApiTags('Families')
@ApiBearerAuth()
@Controller('families')
@UseGuards(JwtAuthGuard)
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all families' })
  async findAll() {
    return this.familyService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get family by ID' })
  async findOne(@Param('id') id: number) {
    return this.familyService.findOne(id);
  }

  @Get(':id/tree')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get family tree structure' })
  async getFamilyTree(@Param('id') id: number) {
    return this.familyService.getFamilyTree(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new family' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() data: CreateFamilyDto) {
    return this.familyService.create(data);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a family' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: number, @Body() data: UpdateFamilyDto) {
    return this.familyService.update(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a family (admin only)' })
  async remove(@Param('id') id: number) {
    return this.familyService.remove(id);
  }
}
// End of file: src/modules/family/family.controller.ts
