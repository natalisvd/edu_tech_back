import { NestFactory } from '@nestjs/core';
import * as cookieParcer from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParcer());

  app.enableCors();

  app.setGlobalPrefix('api');
  const port = process.env.PORT || 5000; 
  await app.listen(port);
}
bootstrap();
