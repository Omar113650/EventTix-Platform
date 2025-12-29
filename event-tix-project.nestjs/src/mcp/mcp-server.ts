// احذف أي imports قديمة لـ McpServer و StdioServerTransport
import 'reflect-metadata';
// الـ imports الصحيحة (مع .js extension عشان ESM في TypeScript)
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
// import { McpServer } from "@modelcontextprotocol/sdk/server/index.js";
import { z } from 'zod';
import { AppDataSource } from '../db/data-source.js'; // تأكد من المسار ده صح حسب هيكلك
import { Event } from '../Event/entities/Event.entities.js'; // عدل المسار لو مختلف
// تهيئة الداتابيز مرة واحدة
async function initializeDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('Database connected for MCP server');
  }
}

// إنشاء الـ MCP Server
const server = new McpServer({
  name: 'events-app',
  version: '1.0.0',
});

// Tool 1: أرخص الإيفنتات
server.registerTool(
  'get_cheapest_events',
  {
    description: 'جلب الإيفنتات الأرخص سعرًا (ترتيب تصاعدي، يشمل المجانية)',
    inputSchema: {
      limit: z
        .number()
        .min(1)
        .max(50)
        .optional()
        .default(10)
        .describe('عدد الإيفنتات المطلوب (من 1 إلى 50)'),
    },
  },
  async ({ limit }) => {
    await initializeDB();

    const events = await AppDataSource.getRepository(Event)
      .createQueryBuilder('event')
      .orderBy('event.price', 'ASC')
      .addOrderBy('event.startAt', 'ASC') // ترتيب إضافي حسب التاريخ
      .take(limit)
      .getMany();

    if (events.length === 0) {
      return {
        content: [{ type: 'text', text: '🙅‍♂️ مفيش إيفنتات متاحة حاليًا.' }],
      };
    }

    const formatted = events
      .map((e) =>
        `
**${e.title}**
سعر: ${e.price === 0 ? 'مجاني 🎉' : `${e.price} جنيه`}
مكان: ${e.location}
وقت البداية: ${new Date(e.startAt).toLocaleString('ar-EG')}
الوصف: ${e.description || 'لا يوجد وصف'}
---
      `.trim(),
      )
      .join('\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `🔥 أرخص ${events.length} إيفنتات:\n\n${formatted}`,
        },
      ],
    };
  },
);
server.registerTool(
  'get_most_booked_events',
  {
    description: 'جلب الإيفنتات الأكثر حجزًا حسب عدد الـ bookings',
    inputSchema: {
      limit: z
        .number()
        .min(1)
        .max(50)
        .optional()
        .default(10)
        .describe('عدد الإيفنتات المطلوب (من 1 إلى 50)'),
    },
  },
  async ({ limit }) => {
    await initializeDB();

    const events = await AppDataSource.getRepository(Event)
      .createQueryBuilder('event')
      .leftJoin('event.bookings', 'booking')
      .groupBy('event.id')
      .orderBy('COUNT(booking.id)', 'DESC')
      .addOrderBy('event.startAt', 'ASC')
      .take(limit)
      .select(['event', 'COUNT(booking.id) AS bookingCount'])
      .getRawMany();

    if (events.length === 0) {
      return {
        content: [{ type: 'text', text: '🙅‍♂️ مفيش إيفنتات متاحة حاليًا.' }],
      };
    }

    const formatted = events
      .map((e: any) =>
        `
**${e.event_title}**
عدد الحجوزات: ${e.bookingCount || 0} شخص 👥
سعر: ${e.event_price === 0 ? 'مجاني 🎉' : `${e.event_price} جنيه`}
مكان: ${e.event_location}:${e.events_db}
}
---
      `.trim(),
      )
      .join('\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `🏆 أكثر ${events.length} إيفنتات حجزًا:\n\n${formatted}`,
        },
      ],
    };
  },
);
// تشغيل الـ Server عبر stdio (ده اللي Claude بيستخدمه)
const transport = new StdioServerTransport();
server.connect(transport);

// console.log("🚀 MCP Events Server جاهز وشغال... بانتظار طلبات Claude!");
console.error('[MCP] Server connected and ready');
