import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Course } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CourseCreateInput): Promise<Course> {
    const course = await this.prisma.course.create({
      data,
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
      },
    });
  }

  async update(id: string, data: Prisma.CourseUpdateInput): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Course> {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
