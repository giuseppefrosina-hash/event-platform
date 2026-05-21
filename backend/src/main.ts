import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
  );

  app.enableCors({
    origin: [
      'https://app.uniquo.it',
      'https://event-platform-six-fawn.vercel.app',
      'https://event-platform-git-main-giuseppes-projects-70d696f9.vercel.app',
      'http://localhost:3000',
    ],
    credentials: true,
  });

  const config =
    new DocumentBuilder()
      .setTitle('Event Platform API')
      .setDescription(
        'API documentation',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'api',
    app,
    document,
  );

  const port =
    process.env.PORT || 3000;

  await app.listen(port);

  console.log(
    `Backend running on port ${port}`,
  );
}

bootstrap();