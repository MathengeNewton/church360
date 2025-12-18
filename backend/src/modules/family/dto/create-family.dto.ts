import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FamilyMemberInputDto } from './create-family-member.dto';

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
    description: 'Primary member (head of household)',
    type: FamilyMemberInputDto,
  })
  @ValidateNested()
  @Type(() => FamilyMemberInputDto)
  primaryMember: FamilyMemberInputDto;

  @ApiProperty({
    description: 'Spouse (optional)',
    type: FamilyMemberInputDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FamilyMemberInputDto)
  spouse?: FamilyMemberInputDto;

  @ApiProperty({
    description: 'Offsprings/Children (optional)',
    type: [FamilyMemberInputDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FamilyMemberInputDto)
  offsprings?: FamilyMemberInputDto[];
}
