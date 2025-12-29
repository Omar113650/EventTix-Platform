import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from '../../Auth/entities/user.entities';
import { EventCategory } from '../../Category/entities/Category.entities';
import { Booking } from '../../Book/entities/book.entities';
import { Community } from '../../Community/entities/community.entities';
import { Notification } from '../../Notification/entities/Notification.entities';

@Entity('Events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30 })
  title: string;

@Column({ name: 'profile_image', type: 'text', nullable: true })
  Image: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  location: string;

  @Column({ type: 'timestamp' })
  startAt: Date;

  @Column({ type: 'timestamp' })
  endAt: Date;

  @Column({ type: 'int' })
  capacity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    enum: ['price', ' for free'],
  })
  price: number;

  @Column({ type: 'varchar', length: 300, nullable: true })
  comment: string;

  // ManyToOne مع User
  @ManyToOne(() => User, (user) => user.events, { nullable: false })
  user: User;

  // ManyToOne مع EventCategory
  @ManyToOne(() => EventCategory, (category) => category.events, {
    nullable: false,
  })
  category: EventCategory;

  // ManyToMany مع Bookings
  @ManyToMany(() => Booking, (booking) => booking.events)
  bookings: Booking[];

  //   @OneToMany(() => Booking, (booking) => booking.event)
  // bookings: Booking[];

  // ManyToMany مع Community
  @ManyToMany(() => Community, (community) => community.events)
  @JoinTable()
  communities: Community[];

  @ManyToOne(() => Notification, (notification) => notification.event)
  notification: Notification;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
