import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SwaggerModule, DocumentBuilder} from "@nestjs/swagger";

async function bootstrap() {
  const port = parseInt(process.env.BACKEND_PORT, 10) || 4000;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Sinova Test Assignment Rest API Documentation")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(port, "0.0.0.0");
}

bootstrap();
