import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// import { UserService } from 'src/user/user.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // constructor(private readonly userService: UserService) {
  //   super();
  // }

  async onModuleInit() {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);

    try {
      console.log('Connecting to Prisma...');
      await this.$connect();
      console.log('Connection successful.');

      console.log('Running seed...');
      // await this.runSeed()
    } catch (error) {
      console.log('Prisma error:', error);
    }
  }
  // async runSeed() {
  //   try {
  //     console.log('Running seed...');

  //     await this.userService.save({
  //       email: 'testTeamleader@gmail.com',
  //       password: '123456',
  //       roles: ['TEAMLEADER'],
  //     });

  //     await this.userService.save({
  //       email: 'testDeveloper@gmail.com',
  //       password: '123456',
  //       roles: ['DEVELOPER'],
  //     });

  //     console.log('Seed data has been added.');
  //   } catch (e) {
  //     console.error('Error during seeding:', e);
  //   }
  // }
}