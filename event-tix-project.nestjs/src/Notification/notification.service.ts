// src/notification/notification.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/Notification.entities';
import { CreateNotificationDto } from './dto/Create.Notification.dto';
import { UpdateNotificationDto } from './dto/Update.Notification.dto';
import { User } from '../Auth/entities/user.entities';
import { Event } from '../Event/entities/Event.entities';
import { EmailService } from '../email/email.service';
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateNotificationDto) {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');

    const event = dto.eventId
      ? await this.eventRepository.findOneBy({ id: dto.eventId })
      : null;

    const notification = this.notificationRepository.create({
      type: dto.type,
      title: dto.title,
      body: dto.body,
      user,
      ...(event && { event }),
    });

    const savedNotification =
      await this.notificationRepository.save(notification);

    await this.emailService.NotificationNewEvent({
      to: user.email,
      subject: savedNotification.title,
      title: savedNotification.title,
      body: savedNotification.body,
    });

    return savedNotification;
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async update(id: string, dto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    Object.assign(notification, dto);
    return this.notificationRepository.save(notification);
  }

  async remove(id: string): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }
}
