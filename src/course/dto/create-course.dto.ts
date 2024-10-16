import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsArray, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: 'Course name', example: 'NestJS Basics' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Course description', example: 'Learn the basics of NestJS framework' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Author ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  authorId: string;

  @ApiPropertyOptional({ description: 'Course image URL', example: 'http://example.com/course-image.png' })
  @IsOptional()
  @IsUrl()
  courseImageUrl?: string;

  @ApiPropertyOptional({ 
    description: 'Array of skill IDs associated with the course', 
    example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  skillIds?: string[];
}
