// districts.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from './entities/district.entity';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<District[]> {
    return this.districtRepo.find({
      relations: ['members'],
    });
  }

  async findOne(id: number): Promise<District> {
    const district = await this.districtRepo.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found`);
    }
    return district;
  }

  async create(createDto: CreateDistrictDto): Promise<District> {
    const district = this.districtRepo.create({
      ...createDto,
      leaderIds: [],
      memberCount: 0,
    });
    return this.districtRepo.save(district);
  }

  async update(id: number, updateDto: UpdateDistrictDto): Promise<District> {
    const district = await this.districtRepo.findOne({ where: { id } });
    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found`);
    }
    Object.assign(district, updateDto);
    return this.districtRepo.save(district);
  }

  async delete(id: number): Promise<void> {
    const district = await this.districtRepo.findOne({ where: { id } });
    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found`);
    }
    
    // Check if district has members
    const memberCount = await this.userRepo.count({ where: { districtId: id } });
    if (memberCount > 0) {
      throw new BadRequestException(
        `Cannot delete district with ${memberCount} members. Please reassign members first.`
      );
    }
    
    await this.districtRepo.remove(district);
  }

  async deleteAll(): Promise<void> {
    await this.districtRepo.delete({});
  }

  // District Leadership Methods
  async assignLeaders(districtId: number, userIds: number[]): Promise<District> {
    const district = await this.findOne(districtId);
    
    // Validate that all users exist and belong to this district
    const users = await this.userRepo.find({
      where: userIds.map(id => ({ id, districtId })),
    });

    if (users.length !== userIds.length) {
      throw new BadRequestException(
        'One or more users do not exist or do not belong to this district'
      );
    }

    // Merge with existing leaders (avoid duplicates)
    const uniqueLeaderIds = [...new Set([...district.leaderIds, ...userIds])];
    district.leaderIds = uniqueLeaderIds;
    
    return this.districtRepo.save(district);
  }

  async removeLeader(districtId: number, userId: number): Promise<District> {
    const district = await this.findOne(districtId);
    
    district.leaderIds = district.leaderIds.filter(id => id !== userId);
    
    return this.districtRepo.save(district);
  }

  async getLeaders(districtId: number): Promise<User[]> {
    const district = await this.findOne(districtId);
    
    if (district.leaderIds.length === 0) {
      return [];
    }

    return this.userRepo.find({
      where: district.leaderIds.map(id => ({ id })),
      relations: ['roles'],
    });
  }

  async getMembers(districtId: number): Promise<User[]> {
    const district = await this.findOne(districtId);
    
    return this.userRepo.find({
      where: { districtId: district.id },
      relations: ['roles'],
    });
  }

  async updateMemberCount(districtId: number): Promise<void> {
    const count = await this.userRepo.count({ where: { districtId } });
    await this.districtRepo.update(districtId, { memberCount: count });
  }
}

