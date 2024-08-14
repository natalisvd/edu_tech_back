import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  teamName: string;

  @IsString()
  teamLeaderId: string;

  @IsArray()
  @IsOptional()
  participantIds?: string[];
}

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  teamName?: string;

  @IsOptional()
  @IsString()
  teamLeaderId?: string;

  @IsOptional()
  @IsArray()
  participantIds?: string[];
}
