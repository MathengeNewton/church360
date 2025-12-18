import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Family } from './entities/family.entity';
import { FamilyMember, FamilyMemberRole } from './entities/family-member.entity';
import { User, UserType } from '../users/entities/user.entity';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { District } from '../regions/entities/district.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family) private readonly familyRepo: Repository<Family>,
    @InjectRepository(FamilyMember) private readonly familyMemberRepo: Repository<FamilyMember>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(District) private readonly districtRepo: Repository<District>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async findAll(): Promise<Family[]> {
    return await this.familyRepo.find({ relations: ['members', 'members.user'] });
  }

  async findOne(id: number): Promise<Family> {
    const family = await this.familyRepo.findOne({
      where: { id },
      relations: ['members', 'members.user', 'members.user.district'],
    });
    if (!family) {
      throw new NotFoundException('Family not found');
    }
    return family;
  }

  /**
   * Get or create a user for family member
   */
  private async getOrCreateUser(
    memberInput: { userId?: number; user?: { username: string; email?: string; districtId: number } },
    userType: UserType,
  ): Promise<User> {
    // If userId provided, fetch existing user
    if (memberInput.userId) {
      const user = await this.userRepo.findOne({
        where: { id: memberInput.userId },
        relations: ['district'],
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${memberInput.userId} not found`);
      }
      // Update userType if needed
      if (user.userType !== userType) {
        user.userType = userType;
        await this.userRepo.save(user);
      }
      return user;
    }

    // Create new user if user data provided
    if (memberInput.user) {
      const { username, email, districtId } = memberInput.user;

      // Check if username already exists
      const existingUser = await this.userRepo.findOne({ where: { username } });
      if (existingUser) {
        throw new BadRequestException(`User with username "${username}" already exists`);
      }

      // If email provided, check if it already exists
      if (email) {
        const existingEmailUser = await this.userRepo.findOne({ where: { email } });
        if (existingEmailUser) {
          throw new BadRequestException(`User with email "${email}" already exists`);
        }
      }

      // Validate district exists
      const district = await this.districtRepo.findOne({ where: { id: districtId } });
      if (!district) {
        throw new NotFoundException(`District with ID ${districtId} not found`);
      }

      // Generate a temporary password (user can reset later)
      const tempPassword = await bcrypt.hash('temp123', 10);

      // Get default role (usually 'user' or 'member')
      const defaultRole = await this.roleRepo.findOne({ where: { name: 'app' } });
      const roles = defaultRole ? [defaultRole] : [];

      // Generate unique email if not provided
      let finalEmail = email;
      if (!finalEmail) {
        let emailAttempt = `${username}@church360.local`;
        let attemptCount = 0;
        while (await this.userRepo.findOne({ where: { email: emailAttempt } })) {
          attemptCount++;
          emailAttempt = `${username}${attemptCount}@church360.local`;
        }
        finalEmail = emailAttempt;
      }

      const user = this.userRepo.create({
        username,
        email: finalEmail,
        password: tempPassword,
        districtId,
        userType,
        roles,
      });

      const savedUser = await this.userRepo.save(user);
      
      // Update district member count
      await this.updateDistrictMemberCount(districtId);

      return savedUser;
    }

    throw new BadRequestException('Either userId or user data must be provided');
  }

  async create(data: CreateFamilyDto): Promise<Family> {
    // Create the family first
    const family = this.familyRepo.create({
      name: data.name,
      address: data.address,
      generations: data.generations,
    });
    const savedFamily = await this.familyRepo.save(family);

    // Handle primary member
    const primaryUser = await this.getOrCreateUser(
      data.primaryMember,
      UserType.PRIMARY_MEMBER,
    );
    const primaryMember = this.familyMemberRepo.create({
      familyId: savedFamily.id,
      userId: primaryUser.id,
      role: FamilyMemberRole.PRIMARY_MEMBER,
      relationship: data.primaryMember.relationship || 'head',
    });
    await this.familyMemberRepo.save(primaryMember);

    // Handle spouse (optional)
    if (data.spouse) {
      const spouseUser = await this.getOrCreateUser(data.spouse, UserType.SPOUSE);
      const spouseMember = this.familyMemberRepo.create({
        familyId: savedFamily.id,
        userId: spouseUser.id,
        role: FamilyMemberRole.SPOUSE,
        relationship: data.spouse.relationship || 'spouse',
      });
      await this.familyMemberRepo.save(spouseMember);
    }

    // Handle offsprings (optional)
    if (data.offsprings && data.offsprings.length > 0) {
      for (const offspringInput of data.offsprings) {
        const offspringUser = await this.getOrCreateUser(offspringInput, UserType.OFFSPRING);
        const offspringMember = this.familyMemberRepo.create({
          familyId: savedFamily.id,
          userId: offspringUser.id,
          role: FamilyMemberRole.OFFSPRING,
          relationship: offspringInput.relationship || 'child',
        });
        await this.familyMemberRepo.save(offspringMember);
      }
    }

    // Return family with all members loaded
    return this.findOne(savedFamily.id);
  }

  async update(id: number, data: UpdateFamilyDto): Promise<Family> {
    const family = await this.findOne(id);

    // Update basic fields
    if (data.name !== undefined) family.name = data.name;
    if (data.address !== undefined) family.address = data.address;
    if (data.generations !== undefined) family.generations = data.generations;

    await this.familyRepo.save(family);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const family = await this.findOne(id);
    
    // Delete all family members (cascade will handle user deletion if needed)
    await this.familyMemberRepo.delete({ familyId: id });
    
    // Delete the family
    await this.familyRepo.delete(id);
  }

  /**
   * Get family tree structure
   */
  async getFamilyTree(id: number) {
    const family = await this.findOne(id);
    
    const primaryMember = family.members.find(m => m.role === FamilyMemberRole.PRIMARY_MEMBER);
    const spouse = family.members.find(m => m.role === FamilyMemberRole.SPOUSE);
    const offsprings = family.members.filter(m => m.role === FamilyMemberRole.OFFSPRING);

    return {
      family: {
        id: family.id,
        name: family.name,
        address: family.address,
      },
      primaryMember: primaryMember ? {
        ...primaryMember.user,
        relationship: primaryMember.relationship,
      } : null,
      spouse: spouse ? {
        ...spouse.user,
        relationship: spouse.relationship,
      } : null,
      offsprings: offsprings.map(o => ({
        ...o.user,
        relationship: o.relationship,
      })),
    };
  }

  private async updateDistrictMemberCount(districtId: number): Promise<void> {
    const count = await this.userRepo.count({ where: { districtId } });
    const districtRepo = this.districtRepo;
    await districtRepo.update(districtId, { memberCount: count });
  }
}
