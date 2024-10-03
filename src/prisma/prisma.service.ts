import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { runSeed } from './seed';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      console.log('Connecting to Prisma...');
      await this.$connect();
      console.log('Connection successful.');
      
      const userCount = await this.user.count();
      console.log('User count:', userCount);

      if (userCount === 0) {
        console.log('Table is empty, running seed...');
        await runSeed();
      }
    } catch (error) {
      console.log('Prisma error:', error);
    }
  }
}

