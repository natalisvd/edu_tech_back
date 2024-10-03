import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SeedService {
  constructor(private readonly userService: UserService) {}

  async runSeed() {
    try {
      console.log('Running seed...');

      await this.userService.save({
        email: 'testTeamleader@gmail.com',
        password: '123456',
        roles: ['TEAMLEADER'],
      });

      await this.userService.save({
        email: 'testDeveloper@gmail.com',
        password: '123456',
        roles: ['DEVELOPER'],
      });

      console.log('Seed data has been added.');
    } catch (e) {
      console.error('Error during seeding:', e);
    }
  }
}
