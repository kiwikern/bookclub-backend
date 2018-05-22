import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const version = require('../package.json').version;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Bookclub API')
    .setDescription('The bookclub API description')
    .setContactEmail('bookclub@kimkern.de')
    .setVersion(version)
    .addTag('users')
    .addTag('auth')
    .addTag('books')
    .addBearerAuth('Authorization', 'header')
    .setSchemes(process.env.NODE_ENV === 'production' ? 'https' : 'http')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}

bootstrap();
