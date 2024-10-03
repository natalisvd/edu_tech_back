import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SeedService {
  constructor(private readonly userService: UserService) {}

  async runSeed() {
    try {
      console.log('Running seed...');

      await this.userService.save(
        {
          email: 'testTeamleader@gmail.com',
          password: '123456',
        },
        [Role.TEAMLEADER],
      );

      await this.userService.save(
        {
          email: 'testDeveloper@gmail.com',
          password: '123456',
        },
        [Role.DEVELOPER],
      );

      await this.userService.save(
        {
          email: 'testAdmin@gmail.com',
          password: '123456',
        },
        [Role.ADMIN],
      );

      await this.userService.save(
        {
          email: 'testManager@gmail.com',
          password: '123456',
        },
        [Role.MANAGER],
      );

      await this.userService.save(
        {
          email: 'testDesigner@gmail.com',
          password: '123456',
        },
        [Role.DESIGNER],
      );

      console.log('Seed data has been added.');
    } catch (e) {
      console.error('Error during seeding:', e);
    }
  }
}
