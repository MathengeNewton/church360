import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';
import { UserType } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 1, description: 'District ID - REQUIRED', type: Number })
  @IsNumber()
  districtId: number;

  @ApiProperty({ example: [1, 2], description: 'Role IDs', required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  roleIds?: number[];

  @ApiProperty({
    description: 'User type in family context',
    enum: UserType,
    example: UserType.STANDALONE,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;
}
