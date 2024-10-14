import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSkillDto: CreateSkillDto) {
    return await this.prisma.skill.create({
      data: createSkillDto,
    });
  }

  async findAll() {
    return await this.prisma.skill.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.skill.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    return await this.prisma.skill.update({
      where: { id },
      data: updateSkillDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.skill.delete({
      where: { id },
    });
  }

  
}
