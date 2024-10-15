import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Course } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseDto): Promise<Course> {
    const course = await this.prisma.course.create({
      data,
      include: {
        author: true,
      },
    });
    return course;
  }

  async findAll(): Promise<Course[]> {
    return this.prisma.course.findMany({
      include: {
        author: true,
      },
    });
  }

  async findOne(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        author: true,
        lessons: true,
      },
    });
  }

  async update(id: string, data: UpdateCourseDto): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      include: {
        author: true,
      },
      data,
    });
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
