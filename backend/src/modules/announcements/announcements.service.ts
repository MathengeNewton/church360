import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Announcement, AnnouncementType, AnnouncementPriority } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,
  ) {}

  async create(createDto: CreateAnnouncementDto): Promise<Announcement> {
    const announcement = this.announcementRepo.create({
      title: createDto.title,
      content: createDto.content,
      type: createDto.type || AnnouncementType.GENERAL,
      priority: createDto.priority || AnnouncementPriority.MEDIUM,
      isActive: createDto.isActive !== undefined ? createDto.isActive : true,
      isMobileAppVisible: createDto.isMobileAppVisible || false,
      expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : undefined,
      publishedAt: undefined, // Will be set when published
      metadata: createDto.metadata || undefined,
    });
    
    return this.announcementRepo.save(announcement);
  }

  async findAll(filters?: {
    type?: AnnouncementType;
    priority?: AnnouncementPriority;
    isActive?: boolean;
    isMobileAppVisible?: boolean;
    search?: string;
  }): Promise<Announcement[]> {
    const queryBuilder = this.announcementRepo.createQueryBuilder('announcement');

    if (filters?.type) {
      queryBuilder.where('announcement.type = :type', { type: filters.type });
    }

    if (filters?.priority) {
      queryBuilder.andWhere('announcement.priority = :priority', { priority: filters.priority });
    }

    if (filters?.isActive !== undefined) {
      queryBuilder.andWhere('announcement.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.isMobileAppVisible !== undefined) {
      queryBuilder.andWhere('announcement.isMobileAppVisible = :isMobileAppVisible', {
        isMobileAppVisible: filters.isMobileAppVisible,
      });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(announcement.title LIKE :search OR announcement.content LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Filter out expired announcements if isActive filter is true
    if (filters?.isActive === true) {
      queryBuilder.andWhere(
        '(announcement.expiresAt IS NULL OR announcement.expiresAt > :now)',
        { now: new Date() },
      );
    }

    queryBuilder.orderBy('announcement.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async findActive(): Promise<Announcement[]> {
    const now = new Date();
    return this.announcementRepo.find({
      where: {
        isActive: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findMobileAppVisible(): Promise<Announcement[]> {
    const now = new Date();
    return this.announcementRepo.find({
      where: {
        isMobileAppVisible: true,
        isActive: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Announcement> {
    const announcement = await this.announcementRepo.findOne({ where: { id } });
    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }
    return announcement;
  }

  async update(id: number, updateDto: UpdateAnnouncementDto): Promise<Announcement> {
    const announcement = await this.findOne(id);

    if (updateDto.expiresAt) {
      updateDto.expiresAt = new Date(updateDto.expiresAt as any) as any;
    }

    Object.assign(announcement, updateDto);
    return this.announcementRepo.save(announcement);
  }

  async remove(id: number): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementRepo.remove(announcement);
  }

  async publish(id: number): Promise<Announcement> {
    const announcement = await this.findOne(id);
    announcement.isActive = true;
    announcement.publishedAt = new Date();
    return this.announcementRepo.save(announcement);
  }

  async expire(id: number): Promise<Announcement> {
    const announcement = await this.findOne(id);
    announcement.isActive = false;
    announcement.expiresAt = new Date();
    return this.announcementRepo.save(announcement);
  }
}

