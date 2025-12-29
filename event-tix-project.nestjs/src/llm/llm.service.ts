// import { Injectable } from '@nestjs/common';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { EventService } from '../Event/event.service'; // فرضاً عندك service للأحداث

// @Injectable()
// export class LlmService {
//   private model: any;

//   constructor(private readonly eventService: EventService) {
//     // ضيف مفتاحك هنا أو في env
//     const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'PUT_YOUR_GOOGLE_KEY_HERE');
//     this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // أو 'gemini-2.5-pro'
//   }

//   // استخدام الـ AI بدون بيانات من DB
//   async query(prompt: string): Promise<string> {
//     try {
//       const result = await this.model.generateContent(prompt);
//       return result.response.text();
//     } catch (err) {
//       console.error('AI Error:', err);
//       return 'عذراً، حدث خطأ أثناء محاولة الرد.';
//     }
//   }
// async queryWithData(prompt: string): Promise<string> {
//   try {
//     // 1. تجيب كل الأحداث من قاعدة البيانات
//     const data = await this.eventService.getEvents();

//     // 2. نفترض إن المصفوفة موجودة في data.events
//     const events = data.events;

//     // 3. تبني الـ prompt مع البيانات
//     const context = `
// هذه هي الأحداث الموجودة حاليًا في المنصة:
// ${events.map(e => `• ${e.title} بتاريخ ${e.createdAt}`).join('\n')}

// المستخدم سأل: "${prompt}"
// أجب فقط استنادًا للبيانات الموجودة أعلاه.
//     `;

//     // 4. استدعاء الـ AI
//     const result = await this.model.generateContent(context);
//     return result.response.text();
//   } catch (err) {
//     console.error('AI Error:', err);
//     return 'عذراً، حدث خطأ أثناء محاولة الرد.';
//   }
// }
// }




// import { Injectable } from '@nestjs/common';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { EventService } from '../Event/event.service';

// @Injectable()
// export class LlmService {
//   private model: any;

//   constructor(private readonly eventService: EventService) {
//     const genAI = new GoogleGenerativeAI(
//       process.env.GOOGLE_API_KEY || 'PUT_YOUR_GOOGLE_KEY_HERE,
//     );'

//     this.model = genAI.getGenerativeModel({
//       model: 'gemini-2.5-flash',
//     });
//   }

//   // ===============================
//   // Helpers
//   // ===============================

// private prepareEventsForAI(events: any[]) {
//   const map = new Map<string, any>();

//   for (const e of events) {
//     // ✅ نخلق مفتاح ديناميكي يجمع كل القيم
//     const key = Object.keys(e)
//       .map(k => {
//         const val = e[k];
//         if (typeof val === 'string') return val.trim();
//         if (val === undefined || val === null) return '';
//         return val.toString();
//       })
//       .join('|'); // نفصل بين الحقول بـ '|'

//     if (!map.has(key)) {
//       const cleanedEvent: Record<string, any> = {};

//       for (const k of Object.keys(e)) {
//         const val = e[k];
//         if (typeof val === 'string') {
//           cleanedEvent[k] = val.trim();
//         } else if (val === undefined) {
//           cleanedEvent[k] = null;
//         } else {
//           cleanedEvent[k] = val;
//         }
//       }

//       map.set(key, cleanedEvent);
//     }
//   }

//   return Array.from(map.values());
// }


//   private cleanAiResponse(raw: string) {
//     return raw
//       .replace(/```json/gi, '')
//       .replace(/```/g, '')
//       .trim();
//   }

//   // ===============================
//   // Main Method
//   // ===============================

//   async queryWithData(prompt: string): Promise<{
//     events: any[];
//     notes: string;
//   }> {
//     try {
//       const data = await this.eventService.getEvents();

//       // 1️⃣ تجهيز الداتا
//       const safeEvents = this.prepareEventsForAI(data.events);
// // 2️⃣ Prompt صارم
// const context = `
// هذه هي بيانات الأحداث المتاحة بصيغة JSON (كل الحقول موجودة كما هي في الداتا):

// ${JSON.stringify(safeEvents)}

// سؤال المستخدم:
// "${prompt}"

// قواعد صارمة:
// - أجب باستخدام البيانات المعروضة فقط
// - الإخراج يجب أن يكون JSON خام فقط
// - ممنوع Markdown أو أي شرح
// - ممنوع تكرار الأحداث
// - نظف النصوص من المسافات الزائدة
// - يجب الاحتفاظ بجميع الحقول الموجودة في الداتا كما هي، دون حذف أي حقل

// صيغة الإخراج النهائية:
// {
//   "events": [ ...كل الأحداث كما هي مع كل الحقول... ],
//   "notes": ""
// }
// `;


//       // 3️⃣ استدعاء الـ AI
//       const result = await this.model.generateContent(context);

//       // 4️⃣ تنظيف + Parse
//       const cleaned = this.cleanAiResponse(result.response.text());

//       return JSON.parse(cleaned);
//     } catch (err) {
//       console.error('AI Error:', err);

//       return {
//         events: [],
//         notes: 'حدث خطأ أثناء معالجة الطلب',
//       };
//     }
//   }
// }











































import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventService } from '../Event/event.service';
import { VectorDBService } from './vector-db.service';
import { analyzeSentiment } from './sentiment.service';

@Injectable()
export class LlmRagService {
  private model: any;
  private embeddingCache = new Map<string, number[]>(); // cache للـ embeddings

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
      // 1️⃣ Embedding للسؤال مع retry و cache
      const questionEmbedding = await this.embedWithRetry(prompt);

      // 2️⃣ البحث في الـ Vector DB
      const relevantChunks = await this.vectorDB.searchRelevant(questionEmbedding, topN);

      if (!relevantChunks || relevantChunks.length === 0) {
        return { chunks: [], notes: 'لا توجد بيانات ذات صلة بالسؤال' };
      }

      // 3️⃣ تحليل المشاعر
      const enrichedChunks = relevantChunks.map(chunk => ({
        ...chunk,
        sentiment: analyzeSentiment(chunk.text) ?? 'neutral',
      }));

      // 4️⃣ بناء prompt صارم
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

      // 5️⃣ استدعاء Gemini
      const result = await this.model.generateContent(context);
      const rawResponse = result.response.text();
      console.log('RAW LLM RESPONSE:', rawResponse);

      return this.safeParseJSON(rawResponse);
    } catch (err: any) {
      console.error('RAG LLM Error:', err.message || err);

      // 6️⃣ Fallback: استخدام queryWithData التقليدي
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






