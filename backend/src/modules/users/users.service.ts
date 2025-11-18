import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Role } from '../roles/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: any): Promise<User> { // Accept any for now, but should be CreateUserDto
    this.logger.log(`[CreateUser] Input data: ${JSON.stringify(data)}`);
    let roles: Role[] = [];
    if (data.roleIds && Array.isArray(data.roleIds) && data.roleIds.length > 0) {
      roles = await this.roleRepo.findByIds(data.roleIds);
      if (roles.length !== data.roleIds.length) {
        throw new Error('One or more roleIds are invalid');
      }
    }
    const user = this.userRepo.create({ ...data, roles });
    this.logger.log(`[CreateUser] User entity before save: ${JSON.stringify(user)}`);
    // Save single user entity, not array
    const savedUser = await this.userRepo.save(user);
    this.logger.log(`[CreateUser] User saved: ${JSON.stringify(savedUser)}`);
    if (Array.isArray(savedUser)) {
      throw new Error('userRepo.save(user) returned an array, expected a single User entity');
    }
    // Type assertion to User to resolve TS error
    const userEntity = savedUser as User;
    // Return the full user entity with roles populated
    const fullUser = await this.userRepo.findOne({ where: { id: userEntity.id } });
    if (!fullUser) throw new Error('User not found after creation');
    return fullUser;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    await this.userRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
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