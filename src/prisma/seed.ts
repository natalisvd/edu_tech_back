import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function runSeed() {
  try {
    console.log('Running seed...');
    await prisma.user.createMany({
      data: [
        {
          email: 'testTeamleader@gmail.com',
          password: '123456',
          roles: ['TEAMLEADER'],
        },
        {
          email: 'testDeveloper@gmail.com',
          password: '123456',
          roles: ['DEVELOPER'],
        },
      ],
    });

    console.log('Seed data has been added.');
  } catch (e) {
    console.error('Error during seeding:', e);
  } finally {
    await prisma.$disconnect();
  }
}