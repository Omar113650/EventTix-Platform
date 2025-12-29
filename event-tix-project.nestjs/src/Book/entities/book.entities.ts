import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../Auth/entities/user.entities';
import { Event } from '../../Event/entities/Event.entities';
import { IsEnum } from 'class-validator';
import{Notification} from '../../Notification/entities/Notification.entities'
@Entity('Bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    enum: ['confirmed', 'waiting'],
    default: 'waiting',
  })
  status?: 'confirmed' | 'waiting';

  @Column({ type: 'int' })
  seats: number;

  @Column({ type: 'decimal' })
  totalPrice: number;

  // ManyToOne مع User
  @ManyToOne(() => User, (user) => user.bookings, { nullable: false })
  user: User;

  // ManyToMany مع Event
  @ManyToMany(() => Event, (event) => event.bookings)
  @JoinTable()
  events: Event[];
  //   @ManyToOne(() => Event, (event) => event.bookings, { eager: true, nullable: false })
  // event: Event;


  @ManyToOne(() => Notification, (notification) => notification.bookings)
    notification: Notification;
  

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;
}
