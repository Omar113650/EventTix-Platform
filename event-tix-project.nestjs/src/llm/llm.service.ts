import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventService } from '../Event/event.service';
import { VectorDBService } from './vector-db.service';
import { analyzeSentiment } from './sentiment.service';

@Injectable()
export class LlmRagService {
  private model: any;
  private embeddingCache = new Map<string, number[]>(); 

  constructor(
    private readonly eventService: EventService,
    private readonly vectorDB: VectorDBService,
  ) {
    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_API_KEY || process.env.OPENAI_API_KEY || 'PUT_YOUR_GOOGLE_KEY_HERE',
    );
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  private safeParseJSON(text: string) {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return { chunks: [], notes: 'لا يوجد JSON صالح في الرد' };
      return JSON.parse(match[0]);
    } catch {
      return { chunks: [], notes: 'فشل تحليل JSON من الرد' };
    }
  }

  private async embedWithRetry(text: string, retries = 3) {
    if (this.embeddingCache.has(text)) return this.embeddingCache.get(text)!;

    for (let i = 0; i < retries; i++) {
      try {
        const embedding = await this.vectorDB.embedText(text);
        this.embeddingCache.set(text, embedding);
        return embedding;
      } catch (err: any) {
        console.error(`Embedding attempt ${i + 1} failed:`, err.message || err);
        if (err.code !== 'insufficient_quota') throw err;
        await new Promise(r => setTimeout(r, 1000 * (i + 1))); // retry delay
      }
    }
    throw new Error('Exceeded embedding quota, fallback triggered');
  }

  async queryWithRAG(prompt: string, topN = 5) {
    console.log('Step 1: Start queryWithRAG');

    try {
    
      const questionEmbedding = await this.embedWithRetry(prompt);

     
      const relevantChunks = await this.vectorDB.searchRelevant(questionEmbedding, topN);

      if (!relevantChunks || relevantChunks.length === 0) {
        return { chunks: [], notes: 'لا توجد بيانات ذات صلة بالسؤال' };
      }

     
      const enrichedChunks = relevantChunks.map(chunk => ({
        ...chunk,
        sentiment: analyzeSentiment(chunk.text) ?? 'neutral',
      }));

    
      const context = `
أنت نظام RAG.
ممنوع إضافة أي نص خارج JSON.

البيانات المتاحة:
${enrichedChunks
  .map(c => `- النص: "${c.text}"\n  المشاعر: ${c.sentiment}`)
  .join('\n')}

أعد الرد بالصيغة التالية فقط:
{
  "chunks": [
    {
      "answer": "...",
      "sourceText": "...",
      "sentiment": "positive | neutral | negative"
    }
  ],
  "notes": "..."
}
`;

     
      const result = await this.model.generateContent(context);
      const rawResponse = result.response.text();
      console.log('RAW LLM RESPONSE:', rawResponse);

      return this.safeParseJSON(rawResponse);
    } catch (err: any) {
      console.error('RAG LLM Error:', err.message || err);

    
      console.log('Fallback to queryWithData');
      try {
        const data = await this.eventService.getEvents();
        const events = data.events;
        const fallbackContext = `
هذه هي الأحداث الموجودة حاليًا في المنصة:
${events.map(e => `• ${e.title} بتاريخ ${e.createdAt}`).join('\n')}

المستخدم سأل: "${prompt}"
أجب فقط استنادًا للبيانات الموجودة أعلاه.
        `;
        const fallbackResult = await this.model.generateContent(fallbackContext);
        return { chunks: [{ answer: fallbackResult.response.text(), sourceText: '', sentiment: 'neutral' }], notes: 'Fallback: الرد بدون استخدام VectorDB' };
      } catch (e) {
        console.error('Fallback also failed:', e);
        return { chunks: [], notes: 'حدث خطأ أثناء معالجة الطلب' };
      }
    }
  }
}


// http://localhost:3000/event/search?q=برمجة
// http://localhost:3000/event/today
// http://localhost:3000/event/ask
// {
//   "prompt": "اعرض لي أهم الأحداث القادمة في الأسبوع القادم"
// }






