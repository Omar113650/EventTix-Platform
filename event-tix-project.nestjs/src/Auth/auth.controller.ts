import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Version,
  UploadedFile,
  UseInterceptors,
  Param,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';

import { CreateUserDto } from './dto/createUser.dto';
import { VerifyOtpDto } from './dto/VerifyOtp.dto';
import { ResendOtpDto } from './dto/ResendOtp.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { LoginDto } from './dto/login.dto';

import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Authentication')
@Controller('api/auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiOperation({ summary: 'Register new user with OTP verification' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'User registered, OTP sent to email',
  })
  async register(
    @Body() body: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.authService.register(body, file);
  }

  // LOGIN
  @Version('1')
  @Post('login')
  @ApiOperation({ summary: 'User login (must verify OTP first)' })
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body.email, body.password);
  }

  // VERIFY OTP
  @Version('1')
  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify user email using OTP' })
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return await this.authService.verifyOtp(body);
  }

  // RESEND OTP
  @Version('1')
  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP to email' })
  async resendOtp(@Body() body: ResendOtpDto) {
    return await this.authService.resendOtp(body);
  }

  // FORGOT PASSWORD (send reset link)
  @Version('1')
  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset link to user email' })
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.sendResetPasswordLink(email);
  }

  // CHECK RESET PASSWORD LINK
  @Version('1')
  @Get('reset-password/:userId/:token')
  @ApiOperation({ summary: 'Validate reset password link' })
  async getResetLink(
    @Param('userId') userId: string,
    @Param('token') token: string,
  ) {
    return await this.authService.getResetPasswordLink(userId, token);
  }

  // RESET PASSWORD
  @Version('1')
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using link token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }

  // Redirect to Google for login
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  // Google callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    // هنا ترجع JWT أو تسجل دخول في النظام
    return req.user;
  }
}
