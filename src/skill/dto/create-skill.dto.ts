import { Level, TypeOfSkiils } from '@prisma/client';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({
    description: 'Title of the skill',
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Level of the skill',
    enum: ['BEGINER', 'INTERMADIATE', 'ADVANCE'],
  })
  @IsEnum(Level)
  level: Level;

  @ApiProperty({
    description: 'Type of the skill',
    enum: ['PRIMARY', 'ADDITIONAL'],
  })
  @IsEnum(TypeOfSkiils)
  typeOfSkills: TypeOfSkiils;

  @ApiProperty({
    description: 'ID of the course related to the skill (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  courseId?: string;
}
