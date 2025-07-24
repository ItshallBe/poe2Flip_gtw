import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const compression = require('compression');
const bodyParser = require('body-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
