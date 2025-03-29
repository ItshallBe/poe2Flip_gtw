import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlipController } from './flip/flip.controller';

@Module({
  imports: [],
  controllers: [AppController, FlipController],
  providers: [AppService],
})
export class AppModule {}
