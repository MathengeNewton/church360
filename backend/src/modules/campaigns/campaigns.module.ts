import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { CampaignDistribution } from './entities/campaign-distribution.entity';
import { Payment } from '../payments/entities/payment.entity';
import { MonthlyContribution } from '../monthly-contributions/entities/monthly-contribution.entity';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { PaymentsModule } from '../payments/payments.module';
import { MonthlyContributionsModule } from '../monthly-contributions/monthly-contributions.module';
import { AnnualContributionsModule } from '../annual-contributions/annual-contributions.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Campaign,
      CampaignDistribution,
      Payment,
      MonthlyContribution,
    ]),
    PaymentsModule,
    MonthlyContributionsModule,
    AnnualContributionsModule,
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService, JwtAuthGuard, RolesGuard],
  exports: [CampaignsService],
})
export class CampaignsModule {}

