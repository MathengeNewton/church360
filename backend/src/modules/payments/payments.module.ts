import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { MonthlyContribution } from '../monthly-contributions/entities/monthly-contribution.entity';
import { AnnualContribution } from '../annual-contributions/entities/annual-contribution.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MonthlyContributionsModule } from '../monthly-contributions/monthly-contributions.module';
import { AnnualContributionsModule } from '../annual-contributions/annual-contributions.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, MonthlyContribution, AnnualContribution]),
    MonthlyContributionsModule,
    AnnualContributionsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, JwtAuthGuard, RolesGuard],
  exports: [PaymentsService],
})
export class PaymentsModule {}

