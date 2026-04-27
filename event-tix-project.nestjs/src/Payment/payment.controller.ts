import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // يبدأ الدفع
  @Post('checkout')
  async checkout(
    @Body('bookingId') bookingId: string,
    @Body('userId') userId: string,
  ) {
    const checkoutUrl = await this.paymentService.createCheckout(
      bookingId,
      userId,
    );

    return { checkoutUrl };
  }

  @Get('success')
  async success(
    @Query('token') orderId: string,
    @Query('bookingId') bookingId: string,
  ) {
    await this.paymentService.capture(orderId, bookingId);
    return { message: 'Payment completed successfully' };
  }

  @Get('cancel')
  cancel() {
    return { message: 'Payment cancelled' };
  }
}
