import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../Auth/entities/user.entities';
import { Event } from '../../Event/entities/Event.entities';

@Entity('Communities')
export class Community {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  feedbackThisCommunity?: string;

  @ManyToMany(() => User, (user) => user.communities)
  users: User[];

  @ManyToMany(() => Event, (event) => event.communities)
  events :Event[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
