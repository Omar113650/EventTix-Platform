import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('Payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookingId: string;

  @Column()
  userId: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column()
  currency: string;

  @Column({ nullable: true })
  paypalOrderId: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'PAID', 'FAILED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'PAID' | 'FAILED';

  @CreateDateColumn()
  createdAt: Date;
}
