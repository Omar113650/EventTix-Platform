import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { Booking } from '../Book/entities/book.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Booking])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
