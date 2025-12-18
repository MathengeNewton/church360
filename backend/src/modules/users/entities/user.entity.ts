import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { FamilyMember } from '../../family/entities/family-member.entity';
import { District } from '../../regions/entities/district.entity';

export enum UserType {
  PRIMARY_MEMBER = 'PRIMARY_MEMBER',
  SPOUSE = 'SPOUSE',
  OFFSPRING = 'OFFSPRING',
  STANDALONE = 'STANDALONE',
}

@Entity()
export class User {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Username', example: 'username' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'Email', example: 'email', required: false })
  @Column({ unique: true, nullable: true })
  email: string;

  @ApiProperty({ description: 'Password', example: 'password' })
  @Column()
  password: string;

  @ApiProperty({ description: 'Roles', example: 'admin' })
  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[];

  @ApiProperty({ description: 'Family memberships' })
  @OneToMany(() => FamilyMember, (member) => member.user)
  familyMemberships: FamilyMember[];

  @ApiProperty({ description: 'District the user belongs to', required: true })
  @ManyToOne(() => District, (district) => district.members, { nullable: false, eager: true })
  @JoinColumn({ name: 'districtId' })
  district: District;

  @ApiProperty({ description: 'District ID - REQUIRED', example: 1 })
  @Column()
  districtId: number;

  @ApiProperty({
    description: 'User type in family context',
    enum: UserType,
    example: UserType.STANDALONE,
    default: UserType.STANDALONE,
  })
  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.STANDALONE,
  })
  userType: UserType;
}
// End of file: src/modules/users/entities/user.entity.ts
