import { Injectable, BadRequestException } from '@nestjs/common';
import { BookingService } from './Booking.service';
import { CreateBookingDto } from './dto/CreateBookingDto';

@Injectable()
export class EventBookingMcpService {
  constructor(private readonly bookingService: BookingService) {}

  async bookEvent(dto: CreateBookingDto, userId: string) {
    try {
      // حاول تعمل الحجز
      const booking = await this.bookingService.createBooking(dto, userId);

      return {
        type: 'text',
        text: ` Booking confirmed for "${booking.events[0].title}" (${dto.seats} seats). Total: $${booking.totalPrice}`,
      };
    } catch (error: any) {
      if (error.response?.message) {
        return {
          type: 'text',
          text: ` Booking failed: ${error.response.message}`,
        };
      }

      return {
        type: 'text',
        text: ` Booking failed: ${error.message}`,
      };
    }
  }
}
