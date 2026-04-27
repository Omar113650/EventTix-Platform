import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
  Logger,
} from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    this.connection = await amqp.connect('amqp://localhost:5672');
    this.channel = await this.connection.createChannel();

    // Main exchange
    await this.channel.assertExchange('event-exchange', 'topic', {
      durable: true,
    });

    // DLX (Dead Letter Exchange)
    await this.channel.assertExchange('email.dlx', 'direct', { durable: true });
    await this.channel.assertQueue('email.dlq', { durable: true });
    await this.channel.bindQueue('email.dlq', 'email.dlx', 'email.retry');
  }

  async publish(routingKey: string, message: any) {
    this.channel.publish(
      'event-exchange',
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  }

  async createQueue(queueName: string, routingKey: string) {
    await this.channel.assertQueue(queueName, {
      durable: true,
      deadLetterExchange: 'email.dlx',
      deadLetterRoutingKey: 'email.retry',
    });
    await this.channel.bindQueue(queueName, 'event-exchange', routingKey);
  }

  async consume(queueName: string, callback: (data: any) => Promise<void>) {
    await this.channel.prefetch(1);
    await this.channel.consume(queueName, async (msg) => {
      if (!msg) return;


      try {
        const data = JSON.parse(msg.content.toString());
        await callback(data);

        // مؤقتًا يمكنك تعليق ack لتظل الرسائل في queue
        this.channel.ack(msg);
      } catch (err) {
        this.logger.error(
          `Error processing message from ${queueName}: ${err.message}`,
        );
        this.channel.nack(msg, false, false); 
      }
    });
  }

  async onApplicationShutdown() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
