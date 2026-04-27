// src/app.module.ts
import { Module } from '@nestjs/common';
;
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './Auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import databaseConfig from './Config/DB.config';
import { EventModule } from './Event/event.module';
import { CategoryModule } from './Category/category.module';
import jwtConfig from './Config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import{MailModule} from './Mail/mail.module'
import { CommunityModule } from './Community/community.module';
import { BookingModule } from './Book/book.module';
import { EmailModule } from './email/email.module';
import { SearchModule } from './search/search.module';
import { LlmModule } from './llm/llm.module';
import { PaymentModule } from './Payment/payment.module';
import { AiModule } from './ai/ai.module';
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
    PaymentModule,
    AiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
