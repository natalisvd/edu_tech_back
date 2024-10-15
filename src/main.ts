import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service'; 
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const config = new DocumentBuilder()
  .setTitle('Edu Tech')
  .setDescription('API description')
  .setVersion('1.0')
  .addTag('EduTech')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization', 
    credentials: true, 
  });

  app.setGlobalPrefix('api');

  const seedService = app.get(SeedService);

  await seedService.runSeed();

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
