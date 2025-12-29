// import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';
// interface SendEmailProps {
//   to: string;
//   subject?: string;
//   otp?: string;
// }

// @Injectable()
// export class EmailService {
//   private transporter;
//   private readonly logger = new Logger(EmailService.name);

//   constructor(private config: ConfigService) {
//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: this.config.get('APP_EMAIL_ADDRESS'),
//         pass: this.config.get('APP_EMAIL_PASSWORD'),
//       },
//       tls: { rejectUnauthorized: false },
//     });
//   }

//   // إرسال OTP
//   async sendOtpEmail({ to, subject, otp }: SendEmailProps) {
//     this.logger.log(`✉️ Sending OTP email to: ${to}`);

//     const htmlContent = `
//       <div style="font-family: 'Helvetica', Arial, sans-serif; background-color:#f4f4f7; padding:40px 0;">
//         <div style="max-width:600px; margin:0 auto; background:#ffffff; padding:40px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
//           <h1 style="color:#333333; text-align:center; font-size:28px; margin-bottom:10px;">🔐 Verify Your Account</h1>
//           <p style="font-size:16px; color:#555555; text-align:center; margin-bottom:30px;">
//             Use the OTP code below to confirm your account. It will expire in 5 minutes.
//           </p>
//           <div style="text-align:center; margin:30px 0;">
//             <span style="
//               font-size:36px;
//               font-weight:bold;
//               letter-spacing:10px;
//               background:linear-gradient(90deg, #6a11cb, #2575fc);
//               color:#ffffff;
//               padding:20px 35px;
//               border-radius:12px;
//               display:inline-block;
//               box-shadow:0 4px 10px rgba(0,0,0,0.15);
//             ">
//               ${otp}
//             </span>
//           </div>
//           <p style="font-size:14px; color:#777777; text-align:center; margin-bottom:30px;">
//             If you didn't request this, you can safely ignore this email.
//           </p>
//           <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />
//           <p style="font-size:12px; color:#999999; text-align:center;">
//             © ${new Date().getFullYear()} Your Company. All rights reserved.
//           </p>
//         </div>
//       </div>
//     `;

//     await this.transporter.sendMail({
//       from: this.config.get('APP_EMAIL_ADDRESS'),
//       to,
//       subject: subject || 'Your OTP Verification Code',
//       html: htmlContent,
//     });

//     this.logger.log(`✅ OTP email sent successfully to ${to}`);
//   }

//   // إرسال التوكن بعد التأكيد
//   async sendTokenEmail({ to, subject }) {
//     this.logger.log(`✉️ Sending Access Token email to: ${to}`);
//     const htmlContent = `
//   <div style="font-family: 'Helvetica', Arial, sans-serif; background-color:#f4f4f7; padding:40px 0;">
//     <div style="max-width:600px; margin:0 auto; background:#ffffff; padding:40px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.1); text-align:center;">

//       <!-- Header -->
//       <h1 style="color:#333333; font-size:28px; margin-bottom:20px;">✅ Success!</h1>

//       <!-- Success Message -->
//       <p style="font-size:18px; color:#28a745; font-weight:bold; margin-bottom:20px;">
//         Your account has been verified successfully
//       </p>

//       <!-- Extra Info -->
//       <p style="font-size:14px; color:#555555; margin-bottom:30px;">
//         You can now log in and start using your account. Welcome aboard!
//       </p>

//       <!-- Footer -->
//       <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />
//       <p style="font-size:12px; color:#999999;">
//         © ${new Date().getFullYear()} Your Company. All rights reserved.
//       </p>
//     </div>
//   </div>
// `;

//     await this.transporter.sendMail({
//       from: this.config.get('APP_EMAIL_ADDRESS'),
//       to,
//       subject: subject || 'Your Access Token',
//       html: htmlContent,
//     });

//     this.logger.log(`✅ Token email sent successfully to ${to}`);
//   }
// }

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface SendEmailProps {
  to: string;
  subject?: string;
  html?: string;
  otp?: string;
  title?: string;
  body?: string;
}

@Injectable()
export class EmailService {
  private transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get('APP_EMAIL_ADDRESS'),
        pass: this.config.get('APP_EMAIL_PASSWORD'),
      },
      tls: { rejectUnauthorized: false },
    });
  }

  // ============================
  // 🔹 فانكشن عامة للإرسال
  // ============================
  async sendEmail({ to, subject, html }: SendEmailProps) {
    await this.transporter.sendMail({
      from: this.config.get('APP_EMAIL_ADDRESS'),
      to,
      subject,
      html,
    });

    // this.logger.log(`📨 Email sent to ${to}`);
  }

  // ============================
  // 🔹 إرسال OTP
  // ============================
  async sendOtpEmail({ to, subject, otp }: SendEmailProps) {
    this.logger.log(`✉️ Sending OTP email to: ${to}`);

    const htmlContent = `
      <div style="font-family: Helvetica, Arial; background:#f4f4f7; padding:40px 0;">
        <div style="max-width:600px; margin:auto; background:#fff; padding:40px; border-radius:12px;">
          <h1 style="color:#333; text-align:center; font-size:28px;">🔐 Verify Your Account</h1>
          <p style="text-align:center; color:#555;">Use the OTP below. It expires in 5 minutes.</p>
          <div style="text-align:center; margin:30px 0;">
            <span style="
              font-size:36px;
              font-weight:bold;
              letter-spacing:10px;
              background:linear-gradient(90deg,#6a11cb,#2575fc);
              color:#fff;
              padding:20px 35px;
              border-radius:12px;
              display:inline-block;">
              ${otp}
            </span>
          </div>
          <p style="text-align:center; color:#777;">If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: subject || 'Your OTP Verification Code',
      html: htmlContent,
    });
  }

  // ============================
  // 🔹 إرسال رسالة نجاح التحقق من OTP
  // ============================
  async sendOtpSuccessEmail({ to }: SendEmailProps) {
    this.logger.log(`✉️ Sending OTP Success email to: ${to}`);

    const htmlContent = `
      <div style="font-family: Helvetica, Arial; background:#f4f4f7; padding:40px 0;">
        <div style="max-width:600px; margin:auto; background:#fff; padding:40px; border-radius:12px;">
          <h1 style="color:#28a745; text-align:center; font-size:28px;">✅ Verification Successful</h1>
          <p style="text-align:center; color:#555;">
            Your OTP has been verified successfully. You can now log in to your account.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'OTP Verification Successful',
      html: htmlContent,
    });
  }

  // ============================
  // 🔹 رسالة ترحيب بعد تسجيل الدخول
  // ============================
  async sendWelcomeAfterLogin({ to, subject }: SendEmailProps) {
    this.logger.log(`✉️ Sending Welcome email to: ${to}`);

    const htmlContent = `
      <div style="font-family: Helvetica, Arial; background:#f4f4f7; padding:40px 0;">
        <div style="max-width:600px; margin:auto; background:#fff; padding:40px; border-radius:12px; text-align:center;">
          <h1 style="color:#333; font-size:28px;">👋 Welcome Back!</h1>
          <p style="font-size:18px; color:#007bff; font-weight:bold;">
            You have successfully logged in
          </p>
          <p style="font-size:14px; color:#555;">
            We're happy to see you again! If this wasn’t you, secure your account immediately.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: subject || 'Login Notification',
      html: htmlContent,
    });
  }

  // ============================
  // 🔹 إرسال لينك تغيير كلمة المرور
  // ============================
  async sendResetPasswordEmail(to: string, link: string) {
    this.logger.log(`✉️ Sending Reset Password email to: ${to}`);

    const htmlContent = `
    <div style="font-family: Helvetica, Arial; background:#f4f4f7; padding:40px 0;">
      <div style="max-width:600px; margin:auto; background:#fff; padding:40px; border-radius:12px; text-align:center;">
        <h1 style="color:#d9534f; font-size:26px; margin-bottom:20px;">🔑 Reset Your Password</h1>

        <p style="font-size:16px; color:#555; margin-bottom:20px;">
          You requested to reset your password. Click the button below:
        </p>

        <a href="${link}" 
           style="display:inline-block; padding:15px 30px; font-size:16px; color:#fff; 
                  background:#007bff; border-radius:8px; text-decoration:none; margin:20px 0;">
          Reset Password
        </a>

        <p style="font-size:14px; color:#777; margin-top:20px;">
          If you didn't request this, you can ignore this email.
        </p>

        <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />
        <p style="font-size:12px; color:#999;">© ${new Date().getFullYear()} Your Company</p>
      </div>
    </div>
  `;

    return this.sendEmail({
      to,
      subject: 'Reset Your Password',
      html: htmlContent,
    });
  }

  async NotificationNewEvent({ to, subject, title, body }: SendEmailProps) {
    // this.logger.log(`✉️ Sending Notification email to: ${to}`);

    const htmlContent = `
    <div style="font-family: Helvetica, Arial; background:#f4f4f7; padding:40px 0;">
      <div style="max-width:600px; margin:auto; background:#fff; padding:40px; border-radius:12px;">
        <h2 style="color:#333; text-align:center;">🔔 ${title}</h2>
        <p style="font-size:16px; color:#555; margin-top:20px;">${body}</p>
        <div style="margin-top:30px; font-size:12px; color:#999; text-align:center;">
          This notification was sent automatically after event creation.
        </div>
      </div>
    </div>
  `;

    const payload = {
      to,
      subject: subject || title,
      html: htmlContent,
    };

    // ترسل الإيميل مباشرة
    await this.sendEmail(payload);

    // ترجع payload عشان تنشره على RabbitMQ
    return payload;
  }
}
// const link = `${this.config.get<string>('CLIENT_DOMAIN')}/reset-password/${user.id}/${user.resetPasswordToken}`;

// await this.emailService.sendResetPasswordEmail(email, link);
