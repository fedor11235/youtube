import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { checkFfmpeg } from './modules/video/video.utils';

async function bootstrap() {
  const hasFfmpeg = await checkFfmpeg();
  if (!hasFfmpeg) {
    console.error('FFmpeg is required but not found. Please install FFmpeg first.');
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Включаем все уровни логов
  });

  app.enableCors({
    origin: 'http://localhost:9000',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api', {
    exclude: ['docs', 'docs-json', 'docs-yaml']
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Video Hosting API')
    .setDescription('Video Hosting Platform API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();