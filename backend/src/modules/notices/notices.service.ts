import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Notice } from './entities/notice.entity';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepo: Repository<Notice>,
  ) {}

  async create(createDto: CreateNoticeDto): Promise<Notice> {
    const notice = this.noticeRepo.create({
      ...createDto,
      expiresAt: createDto.expiresAt
        ? new Date(createDto.expiresAt)
        : null,
      isActive: createDto.isActive ?? true,
    });

    return this.noticeRepo.save(notice);
  }

  async findAll(
    familyId?: number,
    isActive?: boolean,
  ): Promise<Notice[]> {
    const queryBuilder = this.noticeRepo.createQueryBuilder('notice');

    if (isActive !== undefined) {
      queryBuilder.where('notice.isActive = :isActive', { isActive });
    }

    if (familyId) {
      queryBuilder.andWhere(
        '(notice.targetAudience = :all OR notice.targetAudience = :families OR (notice.targetAudience = :specific AND :familyId = ANY(notice.targetFamilyIds)))',
        {
          all: 'all',
          families: 'families',
          specific: 'specific',
          familyId,
        },
      );
    }

    return queryBuilder
      .orderBy('notice.publishedAt', 'DESC')
      .addOrderBy('notice.priority', 'DESC')
      .getMany();
  }

  async findActiveNotices(familyId?: number): Promise<Notice[]> {
    const now = new Date();
    const queryBuilder = this.noticeRepo
      .createQueryBuilder('notice')
      .where('notice.isActive = :isActive', { isActive: true })
      .andWhere(
        '(notice.expiresAt IS NULL OR notice.expiresAt > :now)',
        { now },
      );

    if (familyId) {
      queryBuilder.andWhere(
        '(notice.targetAudience = :all OR notice.targetAudience = :families OR (notice.targetAudience = :specific AND :familyId = ANY(notice.targetFamilyIds)))',
        {
          all: 'all',
          families: 'families',
          specific: 'specific',
          familyId,
        },
      );
    }

    return queryBuilder
      .orderBy('notice.priority', 'DESC')
      .addOrderBy('notice.publishedAt', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Notice> {
    const notice = await this.noticeRepo.findOne({ where: { id } });

    if (!notice) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }

    return notice;
  }

  async update(id: number, updateDto: UpdateNoticeDto): Promise<Notice> {
    const notice = await this.findOne(id);

    if (updateDto.expiresAt) {
      updateDto.expiresAt = new Date(updateDto.expiresAt) as any;
    }

    Object.assign(notice, updateDto);
    return this.noticeRepo.save(notice);
  }

  async delete(id: number): Promise<void> {
    const notice = await this.findOne(id);
    await this.noticeRepo.remove(notice);
  }

  async publish(id: number): Promise<Notice> {
    const notice = await this.findOne(id);
    notice.publishedAt = new Date();
    notice.isActive = true;
    return this.noticeRepo.save(notice);
  }

  async expire(id: number): Promise<Notice> {
    const notice = await this.findOne(id);
    notice.isActive = false;
    notice.expiresAt = new Date();
    return this.noticeRepo.save(notice);
  }
}

