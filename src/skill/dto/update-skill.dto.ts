import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillDto } from './create-skill.dto';
import { ApiProperty, PartialType as ApiPartialType } from '@nestjs/swagger';

export class UpdateSkillDto extends ApiPartialType(CreateSkillDto) {
  @ApiProperty({
    description: 'Title of the skill',
    type: String,
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Level of the skill',
    enum: ['BEGINER', 'INTERMADIATE', 'ADVANCE'],
    required: false,
  })
  level?: 'BEGINER' | 'INTERMADIATE' | 'ADVANCE';

  @ApiProperty({
    description: 'Type of the skill',
    enum: ['PRIMARY', 'ADDITIONAL'],
    required: false,
  })
  typeOfSkills?: 'PRIMARY' | 'ADDITIONAL';

  @ApiProperty({
    description: 'ID of the course related to the skill (optional)',
    required: false,
  })
  courseId?: string;
}
