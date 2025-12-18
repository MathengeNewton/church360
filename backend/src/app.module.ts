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
import { District } from './modules/regions/entities/district.entity';
import { Family } from './modules/family/entities/family.entity';
import { AnnualContribution } from './modules/annual-contributions/entities/annual-contribution.entity';
import { MonthlyContribution } from './modules/monthly-contributions/entities/monthly-contribution.entity';
import { Payment } from './modules/payments/entities/payment.entity';
import { Notice } from './modules/notices/entities/notice.entity';
import { Sermon } from './modules/sermons/entities/sermon.entity';
import { Announcement } from './modules/announcements/entities/announcement.entity';
import { Event } from './modules/events/entities/event.entity';
import { FamilyMember } from './modules/family/entities/family-member.entity';
import { SeedService } from './core/seed/seed.service';
import { AuthModule } from './modules/auth/auth.module';
import { DistrictsModule } from './modules/regions/districts.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { FamilyModule } from './modules/family/families.module';
import { AnnualContributionsModule } from './modules/annual-contributions/annual-contributions.module';
import { MonthlyContributionsModule } from './modules/monthly-contributions/monthly-contributions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NoticesModule } from './modules/notices/notices.module';
import { SermonsModule } from './modules/sermons/sermons.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { EventsModule } from './modules/events/events.module';
import AppConfig from './core/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, AppConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return configService.get<TypeOrmModuleOptions>('database')!;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Role,
      District,
      Family,
      AnnualContribution,
      MonthlyContribution,
      Payment,
      Notice,
      Sermon,
      Announcement,
      Event,
      FamilyMember,
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
    DistrictsModule,
    UsersModule,
    RolesModule,
    FamilyModule,
    AnnualContributionsModule,
    MonthlyContributionsModule,
    PaymentsModule,
    NoticesModule,
    SermonsModule,
    AnnouncementsModule,
    EventsModule,
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
