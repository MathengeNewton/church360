import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnualContribution } from './entities/annual-contribution.entity';
import { MonthlyContribution } from '../monthly-contributions/entities/monthly-contribution.entity';
import { AnnualContributionsService } from './annual-contributions.service';
import { AnnualContributionsController } from './annual-contributions.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnnualContribution, MonthlyContribution]),
  ],
  controllers: [AnnualContributionsController],
  providers: [AnnualContributionsService, JwtAuthGuard, RolesGuard],
  exports: [AnnualContributionsService],
})
export class AnnualContributionsModule {}

