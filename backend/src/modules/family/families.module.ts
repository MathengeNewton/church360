import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities/family.entity';
import { FamilyMember } from './entities/family-member.entity';
import { User } from '../users/entities/user.entity';
import { District } from '../regions/entities/district.entity';
import { Role } from '../roles/entities/role.entity';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Family, FamilyMember, User, District, Role])],
  providers: [FamilyService, JwtAuthGuard, RolesGuard],
  controllers: [FamilyController],
  exports: [FamilyService],
})
export class FamilyModule {}
