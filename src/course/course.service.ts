import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Course } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseDto): Promise<Course> {
    const { skillIds, ...courseData } = data;

    if (skillIds && skillIds.length > 0) {
      const existingSkills = await this.prisma.skill.findMany({
        where: { id: { in: skillIds } },
      });

      if (existingSkills.length !== skillIds.length) {
        throw new NotFoundException('One or more skills not found');
      }
    }

    const course = await this.prisma.course.create({
      data: {
        ...courseData,
        skills: skillIds
          ? {
              connect: skillIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        author: true,
        skills: true, 
      },
    });

    return course;
  }

  async findAll(): Promise<Course[]> {
    return this.prisma.course.findMany({
      include: {
        author: true,
        skills: true, 
      },
    });
  }

  async findOne(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        author: true,
        lessons: true,
        skills: true, 
      },
    });
  }

  async update(id: string, data: UpdateCourseDto): Promise<Course> {
    const { skillIds, ...courseData } = data;
  
    if (skillIds && skillIds.length > 0) {
      const existingSkills = await this.prisma.skill.findMany({
        where: { id: { in: skillIds } },
      });
  
      if (existingSkills.length !== skillIds.length) {
        throw new NotFoundException('One or more skills not found');
      }
    }
  
    const course = await this.prisma.course.update({
      where: { id },
      data: {
        ...courseData,
        skills: skillIds
          ? {
              set: skillIds.map((id) => ({ id })), 
            }
          : undefined,
      },
      include: {
        author: true,
        skills: true,
      },
    });
  
    return course;
  }

  async remove(id: string): Promise<Course> {
    return this.prisma.course.delete({
      where: { id },
      include: {
        author: true,
      },
    });
  }
}
