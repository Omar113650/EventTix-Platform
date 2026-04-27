import { Body, Controller, Post } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { ChatAiDto } from './dto/chat-ai.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('chat')
  async chat(@Body() dto: ChatAiDto) {
    return {
      reply: await this.geminiService.chatFlash(dto.message),
    };
  }
}