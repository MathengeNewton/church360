import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Family } from 'src/modules/family/entities/family.entity';

@Entity()
export class User {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Username', example: 'username' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'Email', example: 'email' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Password', example: 'password' })
  @Column()
  password: string;

  @ApiProperty({ description: 'Roles', example: 'admin' })
  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[];

  @ApiProperty({ description: 'Family associated with the user' })
  @OneToMany(() => Family, (family) => family.head)
  families: Family[];
}
// End of file: src/modules/users/entities/user.entity.ts
