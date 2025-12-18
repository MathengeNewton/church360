import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateFamilyDto } from './create-family.dto';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateFamilyDto extends PartialType(CreateFamilyDto) {
  @ApiProperty({
    example: 'Smith',
    description: 'Name of the family',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

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
}
