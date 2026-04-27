// import all db to use in mcp
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Event } from '../Event/entities/Event.entities.js';
import { Booking } from '../Book/entities/book.entities.js';
import { User } from '../Auth/entities/user.entities.js';
import { EventCategory } from '../Category/entities/Category.entities.js';
import { Community } from '../Community/entities/community.entities.js';
import { Notification } from '../Notification/entities/Notification.entities.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Omar2023',
  database: 'Event',
  entities: [Event, Booking, User, EventCategory, Community, Notification],
  synchronize: true,
  logging: false,
});
