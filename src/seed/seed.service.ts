import { Injectable } from '@nestjs/common';
import { Role, Level, TypeOfSkiils } from '@prisma/client';
import { SkillService } from 'src/skill/skill.service';
import { UserService } from 'src/user/user.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateSkillDto } from 'src/skill/dto/create-skill.dto';

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: UserService,
    private readonly skillService: SkillService,
  ) {}

  async runSeed() {
    try {
      console.log('Running seed...');

      await this.createUserIfNotExists('testTeamleader@gmail.com', '123456', [
        Role.TEAMLEADER,
      ]);
      await this.createUserIfNotExists('testDeveloper@gmail.com', '123456', [
        Role.DEVELOPER,
      ]);
      await this.createUserIfNotExists('testAdmin@gmail.com', '123456', [
        Role.ADMIN,
      ]);
      await this.createUserIfNotExists('testManager@gmail.com', '123456', [
        Role.MANAGER,
      ]);
      await this.createUserIfNotExists('testDesigner@gmail.com', '123456', [
        Role.DESIGNER,
      ]);

      await this.createSkillIfNotExists({
        title: 'redux',
        level: Level.MIDLE,
        typeOfSkills: TypeOfSkiils.PRIMARY,
      });

      await this.createSkillIfNotExists({
        title: 'typescript',
        level: Level.JUNIOR,
        typeOfSkills: TypeOfSkiils.ADDITIONAL,
      });

      await this.createSkillIfNotExists({
        title: 'React',
        level: Level.SENIOR,
        typeOfSkills: TypeOfSkiils.PRIMARY,
      });
      
      await this.createSkillIfNotExists({
        title: 'Node.js',
        level: Level.MIDLE,
        typeOfSkills: TypeOfSkiils.PRIMARY,
      });
      
      await this.createSkillIfNotExists({
        title: 'GraphQL',
        level: Level.JUNIOR,
        typeOfSkills: TypeOfSkiils.ADDITIONAL,
      });
      
      await this.createSkillIfNotExists({
        title: 'Docker',
        level: Level.MIDLE,
        typeOfSkills: TypeOfSkiils.ADDITIONAL,
      });
      
      await this.createSkillIfNotExists({
        title: 'Python',
        level: Level.SENIOR,
        typeOfSkills: TypeOfSkiils.PRIMARY,
      });

      console.log('Seed data has been added.');
    } catch (e) {
      console.error('Error during seeding:', e);
    }
  }

  private async createUserIfNotExists(
    email: string,
    password: string,
    roles: Role[],
  ) {
    try {
      await this.userService.save({ email, password }, roles);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        console.log(`User with email ${email} already exists. Skipping...`);
      } else {
        throw error;
      }
    }
  }

  private async createSkillIfNotExists(createSkillDto: CreateSkillDto) {
    try {
      await this.skillService.create(createSkillDto);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        console.log(
          `Skill with title "${createSkillDto.title}" already exists. Skipping...`,
        );
      } else {
        throw error;
      }
    }
  }
}
