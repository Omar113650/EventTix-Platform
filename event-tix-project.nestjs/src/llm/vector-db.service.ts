// vector-db.service.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai'; // مثال على OpenAI Embeddings
import { cosineSimilarity } from '../utils/cosineSimilarity'; // دالة لحساب تشابه cosine

@Injectable()
export class VectorDBService {
  private db: Array<{ id: string; text: string; embedding: number[] }> = [];
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  }

  // تحويل نص إلى embedding
  async embedText(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }

  // إضافة chunk / سجل جديد للـ DB
  async addChunk(id: string, text: string) {
    const embedding = await this.embedText(text);
    this.db.push({ id, text, embedding });
  }

  // البحث عن أعلى N تشابه مع السؤال
  async searchRelevant(queryEmbedding: number[], topN = 5) {
    const scored = this.db.map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    scored.sort((a, b) => b.score - a.score); // ترتيب تنازلي
    return scored.slice(0, topN);
  }
}
