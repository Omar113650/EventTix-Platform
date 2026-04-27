import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../Auth/entities/user.entities';
import { Event } from '../../Event/entities/Event.entities';
import { Booking } from 'src/Book/entities/book.entities';

@Entity('Notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  type: string; // booking, event, system ...

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @ManyToOne(() => User, (user) => user.notifications, { nullable: false })
  user: User;

  @OneToMany(() => Event, (event) => event.notification)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @OneToMany(() => Booking, (bookings) => bookings.notification)
  @JoinColumn({ name: 'eventId' })
  bookings: Booking;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
