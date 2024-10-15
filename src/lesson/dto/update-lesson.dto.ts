import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './create-lesson.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
  @ApiProperty({
    description: 'The title of the lesson.',
    example: 'Updated lesson title',
    required: false
  })
  title?: string;

  @ApiProperty({
    description: 'The main content or text of the lesson.',
    example: 'Updated lesson text',
    required: false
  })
  text?: string;

  @ApiProperty({
    description: 'A list of materials associated with the lesson.',
    example: ['updated_link1', 'updated_link2'],
    required: false,
    type: [String]
  })
  materials?: string[];

  @ApiProperty({
    description: 'The index number of the lesson.',
    example: 2,
    required: false
  })
  indexNumber?: number;
}
