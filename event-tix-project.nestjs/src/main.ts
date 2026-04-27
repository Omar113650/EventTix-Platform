import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { VersioningType } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  if (process.env.MCP === 'true') {
  //     const { startMCPServer } = await import('./mcp/mcp.server.js');
  //     startMCPServer();
  //   }

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://guest:guest@localhost:5672'],
  //     queue: 'otp_queue',
  //     queueOptions: { durable: false },
  //   },
  // });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  //   app.enableVersioning({
  //   type: VersioningType.URI,
  // });

  // app.setGlobalPrefix('api');
}
bootstrap();
