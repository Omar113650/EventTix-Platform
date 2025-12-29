import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './Booking.service';
import { BookingController } from './Booking.controller';
import { RolesGuard } from '../Auth/roles/roles.guard';
import { AuthModule } from '../Auth/auth.module';
import { Booking } from './entities/book.entities';
import { EventModule } from '../Event/event.module';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import{EventService} from '../Event/event.service'
import{Event} from '../Event/entities/Event.entities'
import{NotificationModule} from '../Notification/notification.module'
import{EmailModule} from '../email/email.module'
import{RabbitMQModule} from '../rabbitmq/rabbitmq.module'
import{CloudinaryModule} from '../cloudinary/cloudinary.module'
// خلي بالك من حته اني لازم اربط event هنا ذاكرها بقا 
@Module({
  imports: [TypeOrmModule.forFeature([Booking,Event]), AuthModule, EventModule,NotificationModule,EmailModule,RabbitMQModule,CloudinaryModule],
  controllers: [BookingController],
  providers: [BookingService, RolesGuard,EventService],
})
export class BookingModule {}
// implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(AuthMiddleware).forRoutes(BookingController); // أو ممكن تعمل route محدد
//   }
// }
//
