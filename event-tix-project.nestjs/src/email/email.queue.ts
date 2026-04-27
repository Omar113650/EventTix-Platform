import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EmailPublisher {
  constructor(@Inject('EMAIL_QUEUE') private client: ClientProxy) {}

  sendEmail(to: string, subject: string, html: string) {
    this.client.emit('send_email', { to, subject, html });
  }
}
