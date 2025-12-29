import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Booking } from './entities/book.entities';
import { CreateBookingDto } from './dto/CreateBookingDto';
import { UpdateBookingDto } from './dto/UpdateBookingDto';
import { EventService } from '../Event/event.service';
import { Event } from '../Event/entities/Event.entities';
import{NotificationService} from '../Notification/notification.service';
import{EmailService} from '../email/email.service'

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly eventService: EventService,
    private readonly notificationService:NotificationService,
        private readonly emailService:EmailService,
    //  خلي بالم مكانها فوق او قبلها يفرق ف الايرورو ومش هتشتغل
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}
  async createBooking(dto: CreateBookingDto, id: string): Promise<Booking> {
    const { userId, eventId } = dto;

    const event = await this.eventService.getEventById(eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // const book = await this.bookingRepository.findOne({ where: { id } });
    // if (book) {
    //   throw new ForbiddenException('this book in this event is already done ');
    // }

    // 2) اتأكد إن فيه سعة كفاية
    if (event.capacity <= 0) {
      throw new BadRequestException(
        'All seats for this event are already booked',
      );
    }

    if (dto.seats > event.capacity) {
      throw new BadRequestException(`Only ${event.capacity} seats left`);
    }

    // 3) احسب الإجمالي
    const totalPrice = event.price * dto.seats;

    // 4) اعمل booking
    const booking = this.bookingRepository.create({
      ...dto,
      totalPrice,
      events: [event],
      user: { id: userId },
      // event: { id: eventId }
    });

    // 5) قلّل السعة الباقية
    event.capacity -= dto.seats;
    await this.eventRepository.save(event);

  // 8️⃣ أرسل Notification / Email بعد الحجز
  await this.notificationService.create({
    type: 'booking',
    title: `🎫 Booking Confirmed: ${event.title}`,
    body: `Your booking for "${event.title}" (${dto.seats} seats) has been confirmed. Total: $${totalPrice}`,
    userId: userId,
    eventId: event.id,
  });

  await this.emailService.NotificationNewEvent({
    to: 'user@example.com', // استبدلها ببريد المستخدم الحقيقي، ممكن تجيبه من userService
    title: `Booking Confirmed: ${event.title}`,
    body: `Hello! Your booking for "${event.title}" (${dto.seats} seats) has been confirmed. Total: $${totalPrice}`,
  });

    // 6) احفظ الـ booking
    return await this.bookingRepository.save(booking);
  }

  async getBookings() {
    const [bookings, total] = await this.bookingRepository.findAndCount({
      relations: ['user', 'event'],
      order: { createdAt: 'DESC' },
    });

    return { bookings, total };
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'event'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async updateBooking(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.bookingRepository.preload({ id, ...dto });
    if (!booking) throw new NotFoundException('Booking not found');
    return await this.bookingRepository.save(booking);
  }

  async deleteBooking(id: string): Promise<{ message: string }> {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    await this.bookingRepository.remove(booking);
    return { message: 'Booking deleted successfully' };
  }
}
