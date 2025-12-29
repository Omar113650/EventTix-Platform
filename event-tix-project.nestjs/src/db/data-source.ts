import 'reflect-metadata';
import { DataSource } from 'typeorm';

// أضف كل الـ entities اللي عندك في المشروع هنا
import { Event } from '../Event/entities/Event.entities.js';
import { Booking } from '../Book/entities/book.entities.js';
import { User } from '../Auth/entities/user.entities.js';
import { EventCategory } from '../Category/entities/Category.entities.js';
import { Community } from '../Community/entities/community.entities.js';
import { Notification } from '../Notification/entities/Notification.entities.js';
// لو في entities تانية (زي Comment, Feedback, Payment...) أضفها برضو

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Omar2023',
  database: 'Event',
  entities: [
    Event,
    Booking,
    User,
    EventCategory,
    Community,
    Notification,
    // أضف باقي الـ entities هنا لو فيه أكتر
  ],
  synchronize: true, // خليها false في production
  logging: false,
});
