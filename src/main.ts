import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service'; // Импортируем SeedService

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Используем cookie-parser middleware для обработки cookies
  app.use(cookieParser());

  // Включаем CORS с нужными настройками, если нужно
  app.enableCors({
    origin: '*', // укажите разрешенные origins, если необходимо
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization', // необходимые заголовки
    credentials: true, // если вы хотите поддерживать cookies между разными доменами
  });

  // Устанавливаем глобальный префикс для всех маршрутов
  app.setGlobalPrefix('api');

  // Получаем экземпляр SeedService
  const seedService = app.get(SeedService);

  // Выполняем сидирование
  await seedService.runSeed();

  // Слушаем порт, если переменная окружения не установлена, используем 5000
  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
