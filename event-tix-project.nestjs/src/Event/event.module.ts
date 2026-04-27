import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../Auth/auth.module';
import { RolesGuard } from '../Auth/roles/roles.guard';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { Event } from './entities/Event.entities';
import{User} from '../Auth/entities/user.entities'
import { EmailModule } from '../email/email.module';
import { NotificationModule } from '../Notification/notification.module';
import { Notification } from '../Notification/entities/Notification.entities';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { LlmModule } from '../llm/llm.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Notification,User]),
    AuthModule,
    NotificationModule,
    EmailModule,
    CloudinaryModule,
    RabbitMQModule,
    LlmModule,

  ],

  controllers: [EventController],
  providers: [EventService, RolesGuard],
  exports: [EventService],
})
export class EventModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(EventController);
  }
}
