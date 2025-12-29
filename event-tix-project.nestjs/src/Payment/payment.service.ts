import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as paypal from '@paypal/checkout-server-sdk';

import { Payment } from './entities/payment.entity';
import { Booking } from '../Book/entities/book.entities';
import { paypalClient } from './paypal.client';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  // 6️⃣ Create Checkout
  async createCheckout(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const client = paypalClient();

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: booking.totalPrice.toString(),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.BASE_URL}/payment/success?bookingId=${booking.id}`,
        cancel_url: `${process.env.BASE_URL}/payment/cancel?bookingId=${booking.id}`,
      },
    });

    const response = await client.execute(request);

    await this.paymentRepo.save({
      bookingId: booking.id,
      userId,
      amount: booking.totalPrice,
      currency: 'USD',
      paypalOrderId: response.result.id,
    });

    return response.result.links.find((l) => l.rel === 'approve').href;
  }

  // 7️⃣ Capture Payment
  async capture(orderId: string, bookingId: string) {
    const client = paypalClient();

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    await client.execute(request);

    const payment = await this.paymentRepo.findOne({
      where: { paypalOrderId: orderId },
    });

    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (!payment) throw new NotFoundException('Payment not found');

    booking.status = 'confirmed';
    payment.status = 'PAID';

    await this.bookingRepo.save(booking);
    await this.paymentRepo.save(payment);
  }
}
