import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.to';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    // Create the entity instance from the DTO
    const campaign = this.campaignRepo.create(createCampaignDto);
    // Save to database
    return await this.campaignRepo.save(campaign);
  }

  async findAll(): Promise<Campaign[]> {
    // Returns all campaigns. 
    // You might want to filter by { isActive: true } depending on your needs later.
    return await this.campaignRepo.find({
      order: { id: 'DESC' }, // Show newest campaigns first
    });
  }

  async findOne(id: number): Promise<Campaign> {
    const campaign = await this.campaignRepo.findOne({
      where: { id },
      // relations: ['contributions'] // <-- Uncomment if you want to see all contributions when fetching a campaign (careful with large data!)
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return campaign;
  }

  async update(id: number, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    // 1. Check if it exists
    const campaign = await this.findOne(id);

    // 2. Merge the new changes into the existing campaign entity
    Object.assign(campaign, updateCampaignDto);

    // 3. Save the updated entity
    return await this.campaignRepo.save(campaign);
  }

  async remove(id: number): Promise<void> {
    const result = await this.campaignRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
  }
}