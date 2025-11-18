import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the region' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: 'The name of the region', example: 'Nairobi' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false, description: 'The code of the region' })
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
    description: 'Description of the region',
    example: 'Capital city of Kenya',
  })
  description: string;
}
