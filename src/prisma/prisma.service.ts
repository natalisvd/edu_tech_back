import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  async onModuleInit() {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);

    try {
      console.log('Connecting to Prisma...');
      await this.$connect();
      console.log('Connection successful.');

      console.log('Running seed...');
    } catch (error) {
      console.log('Prisma error:', error);
    }
  }
}
