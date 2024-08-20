import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto) {
    const { teamLeaderId, ...teamData } = createTeamDto;
  
    const newTeam = await this.prisma.team.create({
      data: {
        ...teamData,
        teamLeader: {
          connect: { id: teamLeaderId },
        },
      },
      include: {
        teamLeader: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            roles: true,
            avatarUrl: true,
            skills: true,
          },
        },
        participants: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            roles: true,
            avatarUrl: true,
            skills: true,
          },
        },
      },
    });
  
    const participantsWithoutLeader = newTeam.participants.filter(
      participant => participant.id !== teamLeaderId
    );
  
    return {
      ...newTeam,
      participants: participantsWithoutLeader,
    };
  }
  

  async findAll() {
    const teams = await this.prisma.team.findMany({
      include: {
        teamLeader: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            roles: true,
            avatarUrl: true,
            skills: true,
          },
        },
        participants: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            roles: true,
            avatarUrl: true,
            skills: true,
          },
        },
      },
    });
  
    return teams.map((team) => {
      const participantsWithoutLeader = team.participants.filter(
        (participant) => participant.id !== team.teamLeader.id
      );
  
      return {
        ...team,
        participants: participantsWithoutLeader,
      };
    });
  }
  
  async findOne(id: string) {
    return this.prisma.team.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    return this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
    });
  }

  async remove(id: string) {
    return this.prisma.team.delete({
      where: { id },
    });
  }

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
