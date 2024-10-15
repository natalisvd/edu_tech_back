import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Lesson } from '@prisma/client';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data:CreateLessonDto): Promise<CreateLessonDto> {
    return this.prisma.lesson.create({
      data,
    });
  }

  async findAll(): Promise<Lesson[]> {
    return this.prisma.lesson.findMany({
      include: {
        Course: true, 
      },
    });
  }

  async findOne(id: string): Promise<Lesson | null> {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: {
        Course: true, 
      },
    });
  }

  async update(id: string, data:UpdateLessonDto): Promise<CreateLessonDto> {
    return this.prisma.lesson.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Lesson> {
    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
