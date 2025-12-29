import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpDto {

  @ApiProperty({ example: 'omar@gmail.com' })
  @IsEmail()
  email: string;
}







// 🎯 ليه شيلنا createdAt و updatedAt؟

// ➤ دول السيرفر اللي بيعملهم
// ممنوع تيجوا من الـ Front.

// 🎯 ليه شيلنا OTP من CreateUserDto؟

// ➤ لأن المستخدم:

// ما ينفعش يبعط OTP

// الـ Backend هو اللي يولده

// الـ Front ينتظر:
// "Check your email to verify your account"

// زي كل المواقع الكبيرة.