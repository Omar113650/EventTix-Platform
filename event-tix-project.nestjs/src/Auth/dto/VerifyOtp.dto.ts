import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: 'omar@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '65389' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
