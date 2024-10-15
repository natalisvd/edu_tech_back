import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

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

  @ApiProperty({ description: 'Course image URL', example: 'http://example.com/course-image.png', required: false })
  @IsOptional()
  @IsUrl()
  courseImageUrl?: string;
}
