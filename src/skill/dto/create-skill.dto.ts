import { Level, TypeOfSkiils } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  title: string;

  @IsEnum(Level)
  level: Level;

  @IsEnum(TypeOfSkiils)
  typeOfSkills: TypeOfSkiils;

  @IsUUID()
  @IsOptional()
  courseId?: string;
}