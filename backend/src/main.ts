// Polyfill global crypto for TypeORM bug in some Docker/Node 18 builds
// import { randomUUID } from 'crypto';
// (global as any).crypto = { randomUUID };

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('church360 API')
    .setDescription('API documentation for the church360 platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
