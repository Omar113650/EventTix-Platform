// src/notification/notification.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/Notification.entities';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { User } from '../Auth/entities/user.entities';
import { Event } from '../Event/entities/Event.entities';
import{EmailModule } from '../email/email.module'
@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, Event]),EmailModule ],
  controllers: [NotificationController],
  providers: [NotificationService],
    exports: [NotificationService],
})
export class NotificationModule {}
