import { NestFactory } from '@nestjs/core';
import bodyParser from 'body-parser';
import compression from 'compression';
import { AppModule } from './app.module';
import { installProductionDiagnostics } from './diagnostics/production-diagnostics';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  installProductionDiagnostics(app);
  app.use(compression());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
