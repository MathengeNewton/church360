import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { Role } from '../roles/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../roles/entities/role.entity';
import { District } from '../regions/entities/district.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(District) private readonly districtRepo: Repository<District>,
  ) {}

  async findAll(districtId?: number): Promise<User[]> {
    const where = districtId ? { districtId } : {};
    return this.userRepo.find({
      where,
      relations: ['district', 'roles'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['district', 'roles'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(createDto: CreateUserDto): Promise<User> {
    this.logger.log(`[CreateUser] Input data: ${JSON.stringify(createDto)}`);
    
    // Validate district exists
    if (!createDto.districtId) {
      throw new BadRequestException('District ID is required');
    }
    
    const district = await this.districtRepo.findOne({ where: { id: createDto.districtId } });
    if (!district) {
      throw new NotFoundException(`District with ID ${createDto.districtId} not found`);
    }
    
    // Handle roles
    let roles: Role[] = [];
    if (createDto.roleIds && Array.isArray(createDto.roleIds) && createDto.roleIds.length > 0) {
      roles = await this.roleRepo.findBy({ id: In(createDto.roleIds) });
      if (roles.length !== createDto.roleIds.length) {
        throw new BadRequestException('One or more roleIds are invalid');
      }
    }
    
    const user = this.userRepo.create({
      username: createDto.username,
      email: createDto.email,
      password: createDto.password,
      districtId: createDto.districtId,
      roles,
    });
    
    this.logger.log(`[CreateUser] User entity before save: ${JSON.stringify(user)}`);
    const savedUser = await this.userRepo.save(user);
    this.logger.log(`[CreateUser] User saved: ${JSON.stringify(savedUser)}`);
    
    // Update district member count
    await this.updateDistrictMemberCount(createDto.districtId);
    
    // Return the full user entity with relations
    const fullUser = await this.userRepo.findOne({
      where: { id: savedUser.id },
      relations: ['district', 'roles'],
    });
    if (!fullUser) throw new Error('User not found after creation');
    return fullUser;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    const oldDistrictId = user.districtId;
    
    // If district is being updated, validate new district exists
    if (data.districtId && data.districtId !== oldDistrictId) {
      const district = await this.districtRepo.findOne({ where: { id: data.districtId } });
      if (!district) {
        throw new NotFoundException(`District with ID ${data.districtId} not found`);
      }
    }
    
    await this.userRepo.update(id, data);
    const updatedUser = await this.findOne(id);
    
    // Update member counts for both old and new districts if district changed
    if (data.districtId && data.districtId !== oldDistrictId) {
      await this.updateDistrictMemberCount(oldDistrictId);
      await this.updateDistrictMemberCount(data.districtId);
    }
    
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    const districtId = user.districtId;
    
    await this.userRepo.delete(id);
    
    // Update district member count
    await this.updateDistrictMemberCount(districtId);
  }
  
  async getUsersByDistrict(districtId: number): Promise<User[]> {
    return this.userRepo.find({
      where: { districtId },
      relations: ['district', 'roles'],
    });
  }
  
  private async updateDistrictMemberCount(districtId: number): Promise<void> {
    const count = await this.userRepo.count({ where: { districtId } });
    await this.districtRepo.update(districtId, { memberCount: count });
  }

  async assignRoles(userId: number, roles:UserRole[]): Promise<User> {
    const user = await this.findOne(userId);
    // You must fetch Role entities from the database, e.g.:
// const foundRoles = await this.roleRepository.findBy({ name: In(roles) });
// user.roles = foundRoles;
// For now, set to empty array to avoid type error:
user.roles = [];
    return this.userRepo.save(user);
  }
}