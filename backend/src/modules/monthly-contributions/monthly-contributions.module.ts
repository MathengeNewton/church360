import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyContribution } from './entities/monthly-contribution.entity';
import { MonthlyContributionsService } from './monthly-contributions.service';
import { MonthlyContributionsController } from './monthly-contributions.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyContribution])],
  controllers: [MonthlyContributionsController],
  providers: [MonthlyContributionsService, JwtAuthGuard, RolesGuard],
  exports: [MonthlyContributionsService],
})
export class MonthlyContributionsModule {}

