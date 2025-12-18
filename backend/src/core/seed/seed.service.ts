import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../modules/roles/entities/role.entity';
import { User } from '../../modules/users/entities/user.entity';
import { District } from '../../modules/regions/entities/district.entity';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin',
  FIELD_AGENT = 'field_agent',
  STAFF = 'staff',
  VET = 'vet',
  PARTNER = 'partner',
  APP = 'app',
  GUEST = 'guest',
  OWNER = 'owner',
}

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(District) private readonly districtRepo: Repository<District>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
    await this.seedDefaultDistrict();
    await this.seedAdminUser();
  }

  private async seedRoles() {
    const roles = Object.values(UserRole);
    for (const name of roles) {
      const exists = await this.roleRepo.findOne({ where: { name } });
      if (!exists) {
        await this.roleRepo.save(this.roleRepo.create({ name }));
        this.logger.log(`Seeded role: ${name}`);
      }
    }
  }

  private async seedDefaultDistrict() {
    const defaultDistrict = await this.districtRepo.findOne({
      where: { name: 'Default District' },
    });
    if (!defaultDistrict) {
      const district = this.districtRepo.create({
        name: 'Default District',
        code: 'DEFAULT',
        description: 'Default district for initial setup',
        leaderIds: [],
        memberCount: 0,
      });
      await this.districtRepo.save(district);
      this.logger.log('Seeded default district');
    }
  }

  private async seedAdminUser() {
    const adminExists = await this.userRepo.findOne({
      where: { username: 'admin' },
    });
    if (!adminExists) {
      const adminRole = await this.roleRepo.findOne({
        where: { name: UserRole.ADMIN },
      });
      if (!adminRole) {
        throw new Error('Admin role not found! Did you seed roles first?');
      }
      
      // Get or create default district
      let defaultDistrict = await this.districtRepo.findOne({
        where: { name: 'Default District' },
      });
      if (!defaultDistrict) {
        defaultDistrict = this.districtRepo.create({
          name: 'Default District',
          code: 'DEFAULT',
          description: 'Default district for initial setup',
          leaderIds: [],
          memberCount: 0,
        });
        defaultDistrict = await this.districtRepo.save(defaultDistrict);
      }
      
      const user = this.userRepo.create({
        username: 'admin',
        email: 'admin@church360.org',
        password: await bcrypt.hash('admin123', 10),
        roles: [adminRole],
        districtId: defaultDistrict.id,
      });
      await this.userRepo.save(user);
      this.logger.log('Seeded admin user');
    }
  }
}
