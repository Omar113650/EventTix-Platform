import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailConsumer } from './email.consumer';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module'; // export RabbitMQService

@Module({
  imports: [RabbitMQModule],
  providers: [EmailService, EmailConsumer],
  exports: [EmailService],
})
export class EmailModule {}