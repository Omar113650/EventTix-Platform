import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async chatFlash(prompt: string) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL_FLASH || '',
      });

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini Flash Error:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async chatPro(prompt: string) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL_PRO || '',
      });

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      throw new InternalServerErrorException('Gemini Pro Error');
    }
  }
}
