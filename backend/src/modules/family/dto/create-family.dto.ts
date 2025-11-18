import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateFamilyDto {
  @ApiProperty({ example: 'Smith', description: 'Name of the family' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '123 Main St, Springfield',
    description: 'Address of the family',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 3,
    description: 'Number of generations',
    required: false,
  })
  @IsOptional()
  @IsInt()
  generations?: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user who is the head of the family',
  })
  @IsInt()
  headId: number;
}
