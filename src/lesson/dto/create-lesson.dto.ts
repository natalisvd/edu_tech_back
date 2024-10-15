import { IsString, IsArray, IsInt, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({
    description: 'The title of the lesson.',
    example: 'Introduction to NestJS',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The main content or text of the lesson.',
    example: 'This lesson covers the basics of NestJS framework.',
    required: false
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({
    description: 'A list of materials associated with the lesson.',
    example: ['link1', 'link2'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  materials: string[];

  @ApiProperty({
    description: 'The index number of the lesson.',
    example: 1
  })
  @IsInt()
  indexNumber: number;

  @ApiProperty({
    description: 'The ID of the course this lesson belongs to.',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  courseId: string;
}
