import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('EMAIL_HOST'),
          port: config.get<number>('EMAIL_PORT'),
          secure: false,
          auth: {
            user: config.get<string>('EMAIL_USERNAME'),
            pass: config.get<string>('EMAIL_PASSWORD'),
          },
          tls: {
    rejectUnauthorized: false,   // السطر ده هو اللي هيحل المشكلة دلوقتي
  },
        },
   template: {
          // الحل الأهم في التاريخ:
          dir: join(process.cwd(), 'src/mail/templates/'), // مش __dirname أبدًا!
          adapter: new EjsAdapter(),
   }
   
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}






