import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Community } from '../../Community/entities/community.entities';
import { Booking } from '../../Book/entities/book.entities';
import { Event } from '../../Event/entities/Event.entities';
import { Notification } from '../../Notification/entities/Notification.entities';
import { Exclude } from 'class-transformer';
export enum UserRole {
  Admin = 'Admin',
  User = 'User',
  Organizer = 'Organizer',
}

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  email: string;
   
  @Exclude()
  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'address', type: 'varchar', length: 200, nullable: true })
  address: string | null;

  @Column({ name: 'profile_image', type: 'text', nullable: true })
  profileImage: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  otp: string | null;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiresAt: Date | null;

  // @Column({ default: false })
  // isAccountVerified: boolean;

  @Column("boolean", { default: false })
isAccountVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resetPasswordToken: string | null;

  // ManyToMany مع Community
  @ManyToMany(() => Community, (community) => community.users)
  @JoinTable()
  communities: Community[];

  // One User يمكنه أن يكون عنده عدة Bookings
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  // One User يمكنه إنشاء عدة Events
  @OneToMany(() => Event, (event) => event.user)
  events: Event[];
  // One User يمكنه أن يكون عنده عدة Notifications
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

// 🎯 يعني إيه select:false؟

// لما تكتب في TypeORM:

// @Column({ select: false })
// password: string;

// معناها:

// لما تعمل استعلام (SELECT) على الجدول، الحقل ده لن يرجع في النتيجة تلقائيًا، إلا لو طلبته صراحة.

// 🔥 مثال عملي
// بدون select:false

// لو كتبت:

// const user = await userRepo.findOne({ where: { email } });

// هيطلع:

// {
//   "id": "123",
//   "email": "a@a.com",
//   "password": "$2b$10$asdasdasdasd",
//   "otp": "123456",
//   ...
// }

// 💥 كارثة!
// لأن:

// الباسورد بيظهر!

// الـ OTP بيظهر!

// أي API أو لوج في السيرفر ممكن يطبع القيم دي بالغلط.

// وده خطييير جدًا في الأمان.

// مع select:false

// لو عملت:

// const user = await userRepo.findOne({ where: { email } });

// هيطلع:

// {
//   "id": "123",
//   "email": "a@a.com"
//   // لا password
//   // لا otp
// }

// 👏 كده بقى زي كل المواقع الكبيرة.

// ✔ طب ولو محتاج الباسورد مثلاً علشان تعمل login؟

// ساعتها لازم تطلبه بنفسك:

// const user = await userRepo
//   .createQueryBuilder("user")
//   .addSelect(["user.password"])
//   .where("user.email = :email", { email })
//   .getOne();

// ده بيدي لك control كامل
// ➡ الباسورد يظهر فقط في المكان اللي انت محتاجه فيه.
