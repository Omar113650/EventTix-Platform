import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { Event } from './entities/Event.entities';
import { CreateEventDTO } from './dto/createEvent.dto';
import { UpdateDtoEvent } from './dto/updateEvent.dto';
// import{eventMcpClient} from '../mcp/eventClient'
import { NotificationService } from '../Notification/notification.service';
// import{Notification} from '../Notification/entities/Notification.entities'
import { EmailService } from '../email/email.service';
import { privateDecrypt } from 'crypto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
    private readonly rabbitMQService: RabbitMQService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findByDate(date: Date) {
    return this.eventRepository.find({
      where: {
        startAt: date, // ممكن تعمل BETWEEN startAt و endAt لو عايز كل الأحداث اليوم
      },
    });
  }

  async findByKeyword(keyword: string) {
    return this.eventRepository.find({
      where: [
        { title: Like(`%${keyword}%`) },
        { description: Like(`%${keyword}%`) },
        { location: Like(`%${keyword}%`) },
      ],
    });
  }

  async createEvent(
    createEventDTO: CreateEventDTO,
    file?: Express.Multer.File,
  ): Promise<Event> {
    const { userId, categoryId } = createEventDTO;
    // upload image in cloudinary

    let ImageUrl: string | null = null;
    if (file) {
      const result = await this.cloudinaryService.uploadFile(file); // Cloudinary ترجع URL
      ImageUrl = result.secure_url; // ✅ URL كـ string
    }

    const event = this.eventRepository.create({
      ...createEventDTO,
      user: { id: userId },
      category: { id: categoryId },
      Image: ImageUrl,
    });

    // 1️⃣ احفظ الايفنت الأول
    const savedEvent = await this.eventRepository.save(event);

    // 2️⃣ اعمل Notification تلقائي
    await this.notificationService.create({
      type: 'event',
      title: `📢 New Event: ${savedEvent.title}`,
      body: `A new event "${savedEvent.title}" has been created. Check it now.`,
      userId: userId,
      eventId: savedEvent.id,
    });
    // await this.emailService.NotificationNewEvent({
    //   to: 'user@example.com', // البريد الإلكتروني للمستخدم المسؤول عن الحدث
    //   title: `New Event Created: ${savedEvent.title}`,
    //   body: `Hello! A new event "${savedEvent.title}" has been created. Check it now.`,
    // });
    // 3️⃣ تحضير payload الإيميل باستخدام الـ method الجميل
    const emailPayload = await this.emailService.NotificationNewEvent({
      to: 'omarelsga@gmail.com',
      title: savedEvent.title,
      body: `Hello! A new event "${savedEvent.title}" has been created. Check it now.`,
      subject: `New Event: ${savedEvent.title}`,
    });

    // ابعت payload على RabbitMQ
    await this.rabbitMQService.publish('email.send', emailPayload);

    return savedEvent;
  }

  // جلب الأحداث مع فلترة، ترتيب، وباجينايشن
  async getEvents(params?: {
    filter?: {
      minprice?: number;
      maxprice?: number;
    };
    sortedBy?: 'startAt' | 'price';
    order?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ events: Event[]; total: number; page: number; limit: number }> {
    const filterOptions: any = {};

    // فلترة البحث بالكلمة المفتاحية
    if (params?.search) {
      filterOptions.title = Like(`%${params.search}%`);
    }

    // فلترة السعر
    if (params?.filter) {
      const { minprice, maxprice } = params.filter;
      if (minprice !== undefined && maxprice !== undefined) {
        filterOptions.price = Between(minprice, maxprice);
      }
    }

    // ترتيب النتائج
    const sortField = params?.sortedBy ?? 'id';
    const sortOrder = params?.order ?? 'ASC';

    // Pagination
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    // جلب الأحداث من قاعدة البيانات
    const [events, total] = await this.eventRepository.findAndCount({
      where: filterOptions,
      order: { [sortField]: sortOrder },
      skip,
      take: limit,
    });

    if (events.length === 0) {
      throw new NotFoundException('No events found');
    }

    return { events, total, page, limit };
  }

  //  */
  // getAllProducts(title?: string, minPrice?: number, maxPrice?: number) {
  //   const filters = {
  //     ...(title ? { title: Like(`%${title}%`) } : {}),
  //     ...(minPrice && maxPrice ? { price: Between(minPrice, maxPrice) } : {}),
  //   };
  //   return this.productRepository.find({
  //     where: filters,
  //   });
  // }

  // جلب حدث بالـ ID
  async getEventById(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  // تحديث حدث موجود
  async updateEvent(
    id: string,
    updateEventDTO: UpdateDtoEvent,
    file?: Express.Multer.File,
  ): Promise<Event> {
    const updateData: any = { ...updateEventDTO };

    // Handle file upload if provided
    if (file) {
      const result = await this.cloudinaryService.uploadFile(file);
      updateData.Image = result.secure_url;
    } else {
      // Remove Image field if no file is provided to avoid type mismatch
      delete updateData.Image;
    }

    const event = await this.eventRepository.preload({
      id,
      ...updateData,
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return await this.eventRepository.save(event);
  }

  // حذف حدث
  async deleteEvent(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return await this.eventRepository.remove(event);
  }
}

//     async getCheapestEvent() {
//     await connectEventMcpClient();

//     // جلب كل الأحداث من قاعدة البيانات
//     const events = await this.eventRepository.find();

//     if (events.length === 0) throw new NotFoundException('No events found');

//     // استخدام MCP Tool لاختيار الحدث الأرخص
//     const cheapest = await eventMcpClient.callTool('findCheapestEvent', { events });
//     return cheapest;
//   }

// }
// function connectEventMcpClient() {
//   throw new Error('Function not implemented.');
// }
