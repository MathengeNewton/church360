import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { User } from '../users/entities/user.entity';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  // Register the Campaign entity (and User if needed for validation)
  imports: [TypeOrmModule.forFeature([Campaign, User])],
  controllers: [CampaignsController],
  providers: [CampaignsService, JwtAuthGuard, RolesGuard],
  // Export the service so the Contribution Module can use it later
  exports: [CampaignsService],
})
export class CampaignsModule {}