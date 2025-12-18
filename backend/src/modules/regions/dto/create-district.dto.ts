import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateDistrictDto {
  @ApiProperty({ description: 'The name of the district', example: 'Nairobi' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, description: 'The code of the district', example: 'NBI' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    required: false,
    description: 'Array of coordinates in "lat,lng" format',
    example: ['-1.2921,36.8219', '-1.3000,36.8000'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  coordinates?: string[];

  @ApiProperty({
    required: false,
    description: 'Description of the district',
    example: 'Capital city of Kenya',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

