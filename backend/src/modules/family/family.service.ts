import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from './entities/family.entity';
import { User } from '../users/entities/user.entity';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family) private readonly familyRepo: Repository<Family>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<Family[]> {
    // We await the promise here, which resolves the lint warning in the controller
    return await this.familyRepo.find({ relations: ['head'] });
  }

  async findOne(id: number): Promise<Family> {
    const family = await this.familyRepo.findOne({
      where: { id },
      relations: ['head'],
    });
    if (!family) {
      throw new NotFoundException('Family not found');
    }
    return family;
  }

  async create(data: CreateFamilyDto): Promise<Family> {
    const head = await this.userRepo.findOne({ where: { id: data.headId } });
    if (!head) {
      throw new NotFoundException('Family head (User) not found');
    }
    // Create a new family entity from the DTO, linking the found head
    const family = this.familyRepo.create({
      name: data.name,
      address: data.address,
      generations: data.generations,
      head: head,
    });
    return await this.familyRepo.save(family);
  }

  async update(id: number, data: UpdateFamilyDto): Promise<Family> {
    // Use our own findOne to ensure relations are loaded
    const family = await this.findOne(id);

    if (data.headId) {
      const newHead = await this.userRepo.findOne({
        where: { id: data.headId },
      });
      if (!newHead) {
        throw new NotFoundException('New family head (User) not found');
      }
      family.head = newHead;
    }

    // Assign other properties from the DTO
    Object.assign(family, data);
    return await this.familyRepo.save(family);
  }

  async remove(id: number): Promise<void> {
    const result = await this.familyRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Family not found');
    }
  }
}
