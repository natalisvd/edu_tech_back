import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Prisma, Role, User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { convertToSecondsUtil } from 'libs/common/src/utils';
import { JwtPayload } from 'src/auth/interfaces';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async save(user: Partial<User>, roles: Role[] = [Role.DEVELOPER]) {
    const hashedPassword = user?.password
      ? this.hashPassword(user.password)
      : null;
    return this.prismaService.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        roles: {
          set: roles,
        },
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }

  async findAllUsers() {
    return await this.prismaService.user.findMany();
  }

  async findAllTeamLeaders(withTeams: boolean = true) {
    return await this.prismaService.user.findMany({
      where: {
        roles: {
          has: Role.TEAMLEADER,
        },
        ...(!withTeams
          ? {}
          : {
              teamId: null,
            }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roles: true,
        avatarUrl: true,
        teamId: true,
        skills: true
      },
    });
  }

  async findAllWorkers() {
    return await this.prismaService.user.findMany({
      where: {
        roles: {
          has: Role.DEVELOPER || Role.DESIGNER,
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roles: true,
        avatarUrl: true,
        teamId: true,
        skills: true
      },
    });
  }

  async findOne(idOrEmail: string, isReset = false): Promise<User> {
    if (isReset) {
      await this.cacheManager.del(idOrEmail);
    }
    const user = await this.cacheManager.get<User>(idOrEmail);
    if (!user) {
      const user = await this.prismaService.user.findFirst({
        where: {
          OR: [{ id: idOrEmail }, { email: idOrEmail }],
        },
        include: {
          skills: {
            include: {
              skill: {
                select: {
                  title: true,
                  level: true,
                  typeOfSkills: true,
                },
              },
            },
          },
        },
      });
      if (!user) {
        return null;
      }
      await this.cacheManager.set(
        idOrEmail,
        user,
        convertToSecondsUtil(this.configService.get('JWT_EXP')),
      );
      return user;
    }
    return user;
  }

  async delete(id: string, user: JwtPayload) {
    if (user.id !== id && !user.roles.includes(Role.ADMIN)) {
      throw new ForbiddenException();
    }

    await Promise.all([
      this.cacheManager.del(id),
      this.cacheManager.del(user.email),
    ]);

    return this.prismaService.user.delete({
      where: { id },
      select: { id: true },
    });
  }

  async changeUserRole(userId: string, newRole: Role) {
    try {
      return await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          roles: {
            set: [newRole],
          },
        },
        include: {
          skills: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const { skillIds, ...userData } = data;
    //@ts-ignore
    delete userData.skills
    console.log({ skillIds });
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        ...userData,
      },
      include: {
        skills: true,
      },
    });

    if (!skillIds) {
      return updatedUser;
    }

    const existingSkills = await this.prismaService.skill.findMany({
      where: { id: { in: skillIds } },
    });

    if (existingSkills.length !== skillIds.length) {
      console.log('One or more skills not found');
      throw new NotFoundException('One or more skills not found');
    }

    const currentSkills = await this.prismaService.userSkill.findMany({
      where: { userId: id },
      include: {
        skill: true,
      },
    });
    console.log({ currentSkills });

    const skillsToRemove = currentSkills.filter(
      (skill) => !skillIds.includes(skill.skillId) && skill.isConfirmed,
    );
    console.log({ skillsToRemove });

    if (skillsToRemove.length > 0) {
      throw new BadRequestException('Cannot delete or update confirmed skills');
    }

    await this.prismaService.userSkill.deleteMany({
      where: {
        userId: id,
        skillId: { in: skillsToRemove.map((skill) => skill.skillId) },
        isConfirmed: false,
      },
    });

    const skillsToAdd = skillIds.filter(
      (skillId) => !currentSkills.some((skill) => skill.skillId === skillId),
    );
    console.log({ skillsToAdd });
    if (skillsToAdd.length > 0) {
      await this.prismaService.userSkill.createMany({
        data: skillsToAdd.map((skillId) => ({
          userId: id,
          skillId,
          isConfirmed: false,
        })),
      });
    }

    return this.prismaService.user.findUnique({
      where: { id },
      include: {
        skills: true,
      },
    });
  }

  async updateMultipleUsers(users: Partial<User>[]): Promise<void> {
    try {
      const updatePromises = users.map((user) =>
        this.prismaService.user
          .update({
            where: { id: user.id },
            data: user,
            include: {
              skills: true,
            },
          })
          .catch((error) => {
            console.error(`Error updating user with ID ${user.id}:`, error);
          }),
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating multiple users:', error);
      throw new Error('Failed to update multiple users.');
    }
  }
}
