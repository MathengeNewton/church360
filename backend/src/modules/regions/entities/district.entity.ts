import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('regions') // Keep table name as 'regions' for backward compatibility
export class District {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the district' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: 'The name of the district', example: 'Nairobi' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false, description: 'The code of the district' })
  code: string;

  @Column('text', { array: true, nullable: true })
  @ApiProperty({
    required: false,
    description: 'Array of coordinates in "lat,lng" format',
    example: ['-1.2921,36.8219', '-1.3000,36.8000'],
    type: [String],
  })
  coordinates: string[];

  @Column({ nullable: true })
  @ApiProperty({
    required: false,
    description: 'Description of the district',
    example: 'Capital city of Kenya',
  })
  description: string;

  @Column('int', { array: true, default: [] })
  @ApiProperty({
    description: 'Array of user IDs who are district leaders',
    example: [1, 2, 3],
    type: [Number],
  })
  leaderIds: number[];

  @Column({ type: 'int', default: 0 })
  @ApiProperty({
    description: 'Cached count of members in the district',
    example: 150,
  })
  memberCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => User, (user) => user.district)
  members: User[];
}

