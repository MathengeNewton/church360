// regions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,
  ) {}

  async findAll(): Promise<Region[]> {
    return this.regionRepo.find();
  }

  async findOne(id: number): Promise<Region> {
    const region = await this.regionRepo.findOne({ where: { id } });
    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }
    return region;
  }

  async create(region: Region): Promise<Region> {
    return this.regionRepo.save(region);
  }

  async update(id: number, region: Region): Promise<Region> {
    const selectedRegion = await this.regionRepo.findOne({ where: { id } });
    if (!selectedRegion) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }
    Object.assign(selectedRegion, region);
    return this.regionRepo.save(selectedRegion);
  }

  async delete(id: number): Promise<void> {
    const region = await this.regionRepo.findOne({ where: { id } });
    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }
    await this.regionRepo.remove(region);
  }

  async deleteAll(): Promise<void> {
    await this.regionRepo.delete({});
  }

}