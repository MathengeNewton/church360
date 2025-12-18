import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sermon } from './entities/sermon.entity';
import { SermonsService } from './sermons.service';
import { SermonsController } from './sermons.controller';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Sermon])],
  controllers: [SermonsController],
  providers: [SermonsService, JwtAuthGuard, RolesGuard],
  exports: [SermonsService],
})
export class SermonsModule {}

