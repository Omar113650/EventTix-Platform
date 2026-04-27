import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { AiController } from './ai.controller';

@Module({
  controllers: [AiController],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class AiModule {}
