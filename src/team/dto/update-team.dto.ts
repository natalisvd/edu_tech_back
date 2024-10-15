import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTeamDto } from './create-team.dto';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @ApiProperty({
    description: 'The name of the team',
    example: 'Updated Team A',
    required: false,
  })
  teamName?: string;

  @ApiProperty({
    description: 'ID of the team leader',
    example: '12345',
    required: false,
  })
  teamLeaderId?: string;

  @ApiProperty({
    description: 'Array of participant IDs in the team',
    example: ['12345', '67890'],
    required: false,
  })
  participantIds?: string[];
}
