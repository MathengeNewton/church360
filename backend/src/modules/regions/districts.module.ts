// districts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from './entities/district.entity';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([District, User])],
  controllers: [DistrictsController],
  providers: [DistrictsService, JwtAuthGuard, RolesGuard],
  exports: [DistrictsService],
})
export class DistrictsModule {}

