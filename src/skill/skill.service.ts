import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Level, Skill } from '@prisma/client';
import { CreateSkillWithAllLevelsDto } from './dto/create-skill-with-all-levels.dto';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  private async skillExists(title: string, level: Level, id?: string) {
    const existingSkill = await this.prisma.skill.findFirst({
      where: {
        title,
        level,
      },
    });

    if (existingSkill && existingSkill.id !== id) {
      throw new BadRequestException(
        'Skill with this title and level already exists',
      );
    }

    return existingSkill;
  }

  async create(createSkillDto: CreateSkillDto) {
    await this.skillExists(createSkillDto.title, createSkillDto.level);

    return await this.prisma.skill.create({
      data: createSkillDto,
    });
  }

  async createWithAllLevels(createSkillWithAllLevelsDto: CreateSkillWithAllLevelsDto) {
    for (const level of Object.values(Level)) {
      await this.skillExists(createSkillWithAllLevelsDto.title, level);
    }

    const skills: Skill[] = [];
    for (const level of Object.values(Level)) {
      const skill = await this.prisma.skill.create({
        data: {
          ...createSkillWithAllLevelsDto,
          level, 
        },
      });
      skills.push(skill);
    }

    return skills;
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
    await this.skillExists(updateSkillDto.title, updateSkillDto.level, id);

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

  async findSkillByTitleAndLevel(title: string, level: Level) {
    return await this.prisma.skill.findFirst({
      where: {
        title,
        level,
      },
    });
  }
}
