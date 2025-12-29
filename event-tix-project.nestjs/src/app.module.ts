// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './Auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
// import { DatabaseModule } from './Config/DB.config';
import databaseConfig from './Config/DB.config';
import { EventModule } from './Event/event.module';
import { CategoryModule } from './Category/category.module';
import jwtConfig from './Config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import{MailModule} from './Mail/mail.module'
import { CommunityModule } from './Community/community.module';
import { BookingModule } from './Book/book.module';
import { EmailModule } from './email/email.module';
import{SearchModule} from './search/search.module'
import{LlmModule} from './llm/llm.module'
import{PaymentModule} from './Payment/payment.module'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    CloudinaryModule,
    EventModule,
    CategoryModule,
    // MailModule
    CommunityModule,
    BookingModule,
    EmailModule,
    SearchModule,
    LlmModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// import { Module } from '@nestjs/common';
// import { UsersModule } from './users/users.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
// import { EmailModule } from './email/email.module';
// import databaseConfig from './config/DB.config';
// import jwtConfig from './config/jwt.config';

// import { CategoriesModule } from './categories/categories.module';
// import { TagsModule } from './tags/tags.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import { NotificationsModule } from './notifications/notifications.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       load: [databaseConfig, jwtConfig],
//     }),
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (configService: ConfigService) => ({
//         ...configService.get('database'),
//       }),
//       inject: [ConfigService],
//     }),
//     MongooseModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (configService: ConfigService) => ({
//         uri: configService.get('Mongo_DB'),
//       }),
//       inject: [ConfigService],
//     }),
//     UsersModule,
//     AuthModule,
//     OtpModule,
//     EmailModule,
//     NotificationsModule,
//     RedisModule,
//     WorksModule,
//     MediaModule,
//     UploadModule,
//     OrdersModule,
//     CommentsModule,
//     CategoriesModule,
//     TagsModule,
//   ],
//   controllers: [],
//   providers: [],
// })
// export class AppModule { }
