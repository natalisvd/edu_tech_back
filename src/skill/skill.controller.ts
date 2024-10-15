import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  create(@Body() createSkillDto: CreateSkillDto): Promise<CreateSkillDto> {
    return this.skillService.create(createSkillDto);
  }

  @Get()
  findAll(): Promise<CreateSkillDto[]> {
    return this.skillService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CreateSkillDto> {
    return this.skillService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto): Promise<CreateSkillDto> {
    return this.skillService.update(id, updateSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) : Promise<CreateSkillDto>{
    return this.skillService.remove(id);
  }
}
