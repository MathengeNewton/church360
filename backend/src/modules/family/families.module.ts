import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities/family.entity';
import { User } from '../users/entities/user.entity';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Family, User])],
  providers: [FamilyService, JwtAuthGuard, RolesGuard],
  controllers: [FamilyController],
  exports: [FamilyService],
})
export class FamilyModule {}
