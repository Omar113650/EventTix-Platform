// sentiment.service.ts
import Sentiment from 'sentiment';
const sentiment = new Sentiment();

export function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const result = sentiment.analyze(text);
  if (result.score > 0) return 'positive';
  if (result.score < 0) return 'negative';
  return 'neutral';
}






















// كتبة sentiment بسيطة وفعالة لتحليل المشاعر (Sentiment Analysis) في النصوص. باختصار، هي تقدر تحدد إذا كانت الجملة أو النص إيجابية، سلبية، أو محايدة وتعطيك درجة عددية لذلك.

// إيه اللي بتعمله بالضبط:

// تحليل الكلمات:

// تفحص كل كلمة في النص وتقارنها مع قاموس داخلي فيه كلمات إيجابية وسلبية.

// حساب الـ Score:

// كل كلمة إيجابية تزيد النتيجة (+1 عادةً)

// كل كلمة سلبية تقلل النتيجة (-1 عادةً)

// النتيجة النهائية = مجموع تأثير الكلمات في النص

// حساب Comparative Score:

// النتيجة بالنسبة لعدد الكلمات في النص، عشان تقدر تقارن جمل مختلفة الطول.

// تعطي معلومات إضافية:

// tokens: كل الكلمات اللي اتعاملت معاها

// positive: الكلمات الإيجابية الموجودة

// negative: الكلمات السلبية الموجودة

// مثال عملي:
// import Sentiment from 'sentiment';
// const sentiment = new Sentiment();

// const result = sentiment.analyze("I love programming, but debugging is frustrating.");
// console.log(result);


// Output ممكن يكون زي كده:

// {
//   "score": 0,                 // 1 كلمة إيجابية (+1) - 1 كلمة سلبية (-1) = 0
//   "comparative": 0,           // score مقسوم على عدد الكلمات
//   "tokens": ["I","love","programming","but","debugging","is","frustrating"],
//   "words": ["love","frustrating"],
//   "positive": ["love"],
//   "negative": ["frustrating"]
// }


// يعني المكتبة دي أداة سريعة لمعرفة شعور المستخدم أو النصوص، ودي مفيدة جدًا لو عايز تعمل:

// تقييم ردود المستخدمين

// تصنيف التعليقات/المراجعات

// تحليل المشاعر في أي نصوص مستخرجة من قاعدة بيانات أو مستندات

// لو تحب، أقدر أوريك إزاي نربطها مع مشروعك الحالي مع LLM + RAG + VectorDB عشان تحلل كل chunk من النصوص وتجيب مشاعر كل جزء.
// تحب أعمل لك مثال كامل جاهز؟