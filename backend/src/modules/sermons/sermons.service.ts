import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Sermon } from './entities/sermon.entity';
import { CreateSermonDto } from './dto/create-sermon.dto';
import { UpdateSermonDto } from './dto/update-sermon.dto';

@Injectable()
export class SermonsService {
  constructor(
    @InjectRepository(Sermon)
    private readonly sermonRepo: Repository<Sermon>,
  ) {}

  async create(createDto: CreateSermonDto): Promise<Sermon> {
    const sermon = this.sermonRepo.create({
      ...createDto,
      sermonDate: new Date(createDto.sermonDate),
      bibleVerses: createDto.bibleVerses || [],
      isPublished: createDto.isPublished !== undefined ? createDto.isPublished : true,
    });
    return this.sermonRepo.save(sermon);
  }

  async findAll(filters?: {
    published?: boolean;
    preacher?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<Sermon[]> {
    const queryBuilder = this.sermonRepo.createQueryBuilder('sermon');

    if (filters?.published !== undefined) {
      queryBuilder.where('sermon.isPublished = :published', { published: filters.published });
    }

    if (filters?.preacher) {
      queryBuilder.andWhere('sermon.preacher LIKE :preacher', {
        preacher: `%${filters.preacher}%`,
      });
    }

    if (filters?.startDate && filters?.endDate) {
      queryBuilder.andWhere('sermon.sermonDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    } else if (filters?.startDate) {
      queryBuilder.andWhere('sermon.sermonDate >= :startDate', {
        startDate: filters.startDate,
      });
    } else if (filters?.endDate) {
      queryBuilder.andWhere('sermon.sermonDate <= :endDate', {
        endDate: filters.endDate,
      });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(sermon.title LIKE :search OR sermon.notes LIKE :search OR sermon.preacher LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    queryBuilder.orderBy('sermon.sermonDate', 'DESC');

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Sermon> {
    const sermon = await this.sermonRepo.findOne({ where: { id } });
    if (!sermon) {
      throw new NotFoundException(`Sermon with ID ${id} not found`);
    }
    return sermon;
  }

  async update(id: number, updateDto: UpdateSermonDto): Promise<Sermon> {
    const sermon = await this.findOne(id);
    
    if (updateDto.sermonDate) {
      updateDto.sermonDate = new Date(updateDto.sermonDate as any) as any;
    }

    Object.assign(sermon, updateDto);
    return this.sermonRepo.save(sermon);
  }

  async remove(id: number): Promise<void> {
    const sermon = await this.findOne(id);
    await this.sermonRepo.remove(sermon);
  }

  async publish(id: number): Promise<Sermon> {
    const sermon = await this.findOne(id);
    sermon.isPublished = true;
    return this.sermonRepo.save(sermon);
  }

  async unpublish(id: number): Promise<Sermon> {
    const sermon = await this.findOne(id);
    sermon.isPublished = false;
    return this.sermonRepo.save(sermon);
  }
}

