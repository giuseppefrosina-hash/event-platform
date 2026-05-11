import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
  );

  app.enableCors();

  await app.listen(3001);

  console.log(
    'Backend running on http://https://event-platform-vr94.onrender.com',
  );
}

bootstrap();