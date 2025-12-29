import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService], // مهم جدًا لو هنستخدمه بره الموديول
})
export class RabbitMQModule {}
