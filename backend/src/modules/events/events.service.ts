import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Event, EventStatus, EventType } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async create(createDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepo.create({
      ...createDto,
      startDate: new Date(createDto.startDate),
      endDate: new Date(createDto.endDate),
      type: createDto.type || EventType.OTHER,
      status: createDto.status || EventStatus.DRAFT,
      requiresRegistration: createDto.requiresRegistration || false,
      isMobileAppVisible: createDto.isMobileAppVisible || false,
    });
    return this.eventRepo.save(event);
  }

  async findAll(filters?: {
    status?: EventStatus;
    type?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    upcoming?: boolean;
    mobileAppVisible?: boolean;
  }): Promise<Event[]> {
    const queryBuilder = this.eventRepo.createQueryBuilder('event');

    if (filters?.status) {
      queryBuilder.where('event.status = :status', { status: filters.status });
    }

    if (filters?.type) {
      queryBuilder.andWhere('event.type = :type', { type: filters.type });
    }

    if (filters?.upcoming) {
      queryBuilder.andWhere('event.startDate >= :now', { now: new Date() });
      queryBuilder.andWhere('event.status != :cancelled', { cancelled: EventStatus.CANCELLED });
    }

    if (filters?.mobileAppVisible !== undefined) {
      queryBuilder.andWhere('event.isMobileAppVisible = :mobileAppVisible', {
        mobileAppVisible: filters.mobileAppVisible,
      });
    }

    if (filters?.startDate && filters?.endDate) {
      queryBuilder.andWhere('event.startDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    } else if (filters?.startDate) {
      queryBuilder.andWhere('event.startDate >= :startDate', {
        startDate: filters.startDate,
      });
    } else if (filters?.endDate) {
      queryBuilder.andWhere('event.endDate <= :endDate', {
        endDate: filters.endDate,
      });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(event.title LIKE :search OR event.description LIKE :search OR event.location LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    queryBuilder.orderBy('event.startDate', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: number, updateDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    if (updateDto.startDate) {
      updateDto.startDate = new Date(updateDto.startDate as any) as any;
    }
    if (updateDto.endDate) {
      updateDto.endDate = new Date(updateDto.endDate as any) as any;
    }

    Object.assign(event, updateDto);
    return this.eventRepo.save(event);
  }

  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepo.remove(event);
  }

  async publish(id: number): Promise<Event> {
    const event = await this.findOne(id);
    event.status = EventStatus.PUBLISHED;
    return this.eventRepo.save(event);
  }

  async cancel(id: number): Promise<Event> {
    const event = await this.findOne(id);
    event.status = EventStatus.CANCELLED;
    return this.eventRepo.save(event);
  }

  async getUpcoming(limit?: number): Promise<Event[]> {
    const queryBuilder = this.eventRepo
      .createQueryBuilder('event')
      .where('event.startDate >= :now', { now: new Date() })
      .andWhere('event.status = :status', { status: EventStatus.PUBLISHED })
      .orderBy('event.startDate', 'ASC');

    if (limit) {
      queryBuilder.limit(limit);
    }

    return queryBuilder.getMany();
  }

  async getMobileAppVisible(): Promise<Event[]> {
    return this.eventRepo.find({
      where: {
        isMobileAppVisible: true,
        status: EventStatus.PUBLISHED,
      },
      order: {
        startDate: 'ASC',
      },
    });
  }
}

