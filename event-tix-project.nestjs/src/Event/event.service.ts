import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { Event } from './entities/Event.entities';
import { CreateEventDTO } from './dto/createEvent.dto';
import { UpdateDtoEvent } from './dto/updateEvent.dto';
// import{eventMcpClient} from '../mcp/eventClient'
import { NotificationService } from '../Notification/notification.service';
import { EmailService } from '../email/email.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { User } from '../Auth/entities/user.entities';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
z    private readonly eventRepository: Repository<Event>,
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
    private readonly rabbitMQService: RabbitMQService,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.eventRepository.find({
      where: {
        startAt: Between(startOfDay, endOfDay),
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
      const result = await this.cloudinaryService.uploadFile(file);
      ImageUrl = result.secure_url;
    }

    const event = this.eventRepository.create({
      ...createEventDTO,
      user: { id: userId },
      category: { id: categoryId },
      Image: ImageUrl,
    });

    const savedEvent = await this.eventRepository.save(event);

    const user = await this.userRepository.findOneBy({
      id: createEventDTO.userId,
    });
    if (!user) throw new NotFoundException('User not found');

    await this.notificationService.create({
      type: 'event',
      title: ` New Event: ${savedEvent.title}`,
      body: `A new event "${savedEvent.title}" has been created. Check it now.`,
      userId: userId,
      eventId: savedEvent.id,
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    });

    const emailPayload = {
      to: user.email,
      subject: `New Event: ${savedEvent.title}`,
      title: ` New Event: ${savedEvent.title}`,
      body: `A new event "${savedEvent.title}" has been created. Check it now.`,
    };

    await this.rabbitMQService.publish('email.send', emailPayload);

    return savedEvent;
  }

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

    if (params?.search) {
      filterOptions.title = Like(`%${params.search}%`);
    }

    if (params?.filter) {
      const { minprice, maxprice } = params.filter;
      if (minprice !== undefined && maxprice !== undefined) {
        filterOptions.price = Between(minprice, maxprice);
      }
    }
    const sortField = params?.sortedBy ?? 'id';
    const sortOrder = params?.order ?? 'ASC';

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

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

  async getEventById(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async updateEvent(
    id: string,
    updateEventDTO: UpdateDtoEvent,
    file?: Express.Multer.File,
  ): Promise<Event> {
    const updateData: any = { ...updateEventDTO };

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

  async deleteEvent(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return await this.eventRepository.remove(event);
  }
}
