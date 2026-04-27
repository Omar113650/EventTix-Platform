import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { EmailService } from './email.service';

@Injectable()
export class EmailConsumer implements OnModuleInit {
  private readonly logger = new Logger(EmailConsumer.name);
  private readonly QUEUE = 'email.queue';

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly emailService: EmailService,
  ) {}

  async onModuleInit() {
    await this.rabbitMQService.createQueue(this.QUEUE, 'email.send');

    await this.rabbitMQService.consume(this.QUEUE, async (data) => {
      const { to, subject, title, body } = data;

      this.logger.log(` Processing email in background to: ${to}`);

      try {
        await this.emailService.NotificationNewEvent({
          to,
          subject: subject || title,
          title,
          body,
        });
      } catch (error) {
        this.logger.error(`Failed to send email to ${to}: ${error.message}`);
        throw error;
      }
    });
  }
}
