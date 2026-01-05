import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateUserForFamilyDto {
  @ApiProperty({ description: 'Username', example: 'johndoe' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Email', example: 'john@example.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'District ID', example: 1 })
  @IsInt()
  districtId: number;
}

export class FamilyMemberInputDto {
  @ApiProperty({
    description: 'Existing user ID (if user already exists)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty({
    description: 'User data (if creating new user)',
    type: CreateUserForFamilyDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserForFamilyDto)
  user?: CreateUserForFamilyDto;

  @ApiProperty({
    description: 'Relationship description',
    example: 'father',
    required: false,
  })
  @IsOptional()
  @IsString()
  relationship?: string;
}


