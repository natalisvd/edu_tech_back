import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({
    description: 'The name of the team',
    example: 'Team A',
  })
  @IsString()
  teamName: string;

  @ApiProperty({
    description: 'ID of the team leader',
    example: '12345',
  })
  @IsString()
  teamLeaderId: string;

  @ApiProperty({
    description: 'Array of participant IDs in the team',
    example: ['12345', '67890'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  participantIds?: string[];
}
