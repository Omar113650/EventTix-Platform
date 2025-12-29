import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, RequestTimeoutException } from '@nestjs/common';
// import { EMAIL_FROM } from '../utils/constants';
export const EMAIL_FROM = `omar@gmail.com`;


@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Sending email after user logged in
   * @param email email of the logged in user
   */
  async sendLoginEmail(email: string) {
    try {
      const today = new Date();
      await this.mailerService.sendMail({
        to: email,
        from: EMAIL_FROM,
        subject: 'User Logged in',
        template: 'login',
        context: { email, today },
      });
    } catch (err) {
      console.log(err);
      throw new RequestTimeoutException();
    }
  }

  /**
   * Sending OTP email to user
   * @param email user email
   * @param otp 6-digit OTP code
   */
  async sendOtpEmail(email: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: EMAIL_FROM,
        subject: 'Your OTP Code',
        template: 'otp', // هذا الـ template لازم يكون موجود في مجلد templates
        context: { otp },
      });
    } catch (err) {
      console.log(err);
      throw new RequestTimeoutException();
    }
  }

  /**
   * Sending verification link email
   * @param email user email
   * @param link verification link
   */
  async sendVerifyEmail(email: string, link: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: EMAIL_FROM,
        subject: 'Verify your account',
        template: 'verify-email',
        context: { link },
      });
    } catch (err) {
      console.log(err);
      throw new RequestTimeoutException();
    }
  }

  /**
   * Sending reset password email
   * @param email user email
   * @param resetPasswordLink link with reset token
   */
  async sendResetPasswordEmail(email: string, resetPasswordLink: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: EMAIL_FROM,
        subject: 'Reset password',
        template: 'reset-password',
        context: { resetPasswordLink },
      });
    } catch (err) {
      console.log(err);
      throw new RequestTimeoutException();
    }
  }
}


























// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';


// @Injectable()
// export class EmailService {
//     private transporter: nodemailer.Transporter;
//     constructor(private readonly configService: ConfigService) {
//         this.transporter = nodemailer.createTransport({
//             host: this.configService.get<string>('email.host'),
//             port: Number(this.configService.get<number | string>('email.port')),
//             secure: this.configService.get<boolean>('email.secure'),
//             auth: {
//                 user: this.configService.get<string>('email.user'),
//                 pass: this.configService.get<string>('email.pass'),
//             },
//         });
//     }

// async sendOtp(to: string, otp: string) {
//     const mailOptions = {
//       from: this.configService.get<string>('EMAIL_USER'),
//       to,
//       subject: 'Your OTP Code',
//       text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
//     };

//     return this.transporter.sendMail(mailOptions);
//   }
// }