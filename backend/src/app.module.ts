import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './core/config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './modules/users/entities/user.entity';
import { Role } from './modules/roles/entities/role.entity';
import { Region } from './modules/regions/entities/region.entity';
import { Family } from './modules/family/entities/family.entity';
import { AnnualContribution } from './modules/annual-contributions/entities/annual-contribution.entity';
import { MonthlyContribution } from './modules/monthly-contributions/entities/monthly-contribution.entity';
import { Payment } from './modules/payments/entities/payment.entity';
import { Campaign } from './modules/campaigns/entities/campaign.entity';
import { CampaignDistribution } from './modules/campaigns/entities/campaign-distribution.entity';
import { Notice } from './modules/notices/entities/notice.entity';
import { SeedService } from './core/seed/seed.service';
import { AuthModule } from './modules/auth/auth.module';
import { RegionsModule } from './modules/regions/regions.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { FamilyModule } from './modules/family/families.module';
import { AnnualContributionsModule } from './modules/annual-contributions/annual-contributions.module';
import { MonthlyContributionsModule } from './modules/monthly-contributions/monthly-contributions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { NoticesModule } from './modules/notices/notices.module';
import AppConfig from './core/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, AppConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Ensure a valid TypeOrmModuleOptions object is always returned
        return configService.get<TypeOrmModuleOptions>('database')!;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Role,
      Region,
      Family,
      AnnualContribution,
      MonthlyContribution,
      Payment,
      Campaign,
      CampaignDistribution,
      Notice,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = configService.get('app');
        console.log('JWT Config:', {
          hasSecret: !!config?.jwt?.secret,
          expiresIn: config?.jwt?.expiresIn,
        });
        return {
          secret: config?.jwt?.secret || 'fallback_secret_key',
          signOptions: {
            expiresIn: config?.jwt?.expiresIn || '1d',
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    RegionsModule,
    UsersModule,
    RolesModule,
    FamilyModule,
    AnnualContributionsModule,
    MonthlyContributionsModule,
    PaymentsModule,
    CampaignsModule,
    NoticesModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    const appConfig = this.configService.get('app');
    console.log('App Config:', {
      hasJwtConfig: !!appConfig?.jwt,
      hasSecret: !!appConfig?.jwt?.secret,
    });
  }
}
