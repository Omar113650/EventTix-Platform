import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entities';
import { CreateUserDto } from './dto/createUser.dto';
import { VerifyOtpDto } from './dto/VerifyOtp.dto';
import { ResendOtpDto } from './dto/ResendOtp.dto';
import { randomBytes } from 'crypto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { EmailService } from '../email/email.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';

export const generateAccessToken = async (
  jwtService: JwtService,
  user: User,
) => {
  const payload = { id: user.id, role: user.role };
  return await jwtService.signAsync(payload);
};
@Injectable()
export class AuthService {
  // private client: ClientProxy;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly config: ConfigService,
  ) {
    // this.client = ClientProxyFactory.create({
    //   transport: Transport.RMQ,
    //   options: {
    //     urls: ['amqp://guest:guest@localhost:5672'],
    //     queue: 'otp_queue',
    //     queueOptions: { durable: false },
    //   },
    // });
  }

  async register(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) throw new BadRequestException('This user already exists');

    // upload image in cloudinary
    let profileImageUrl: string | null = null;
    if (file) {
      const result = await this.cloudinaryService.uploadFile(file);
      profileImageUrl = result.secure_url;
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const otp = randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 5);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 دقائق

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      otp: otpHash,
      otpExpiresAt,
      profileImage: profileImageUrl,
    });
    await this.userRepository.save(newUser);

    setTimeout(
      async () => {
        const user = await this.userRepository.findOne({
          where: { id: newUser.id },
        });
        if (user && user.otp && new Date() >= user.otpExpiresAt!) {
          user.otp = null;
          user.otpExpiresAt = null;
          await this.userRepository.save(user);
        }
      },
      5 * 60 * 1000,
    );

    await this.emailService.sendOtpEmail({
      to: createUserDto.email,
      otp,
      subject: 'Your OTP Verification Code',
    });
    
    const accessToken = await generateAccessToken(this.jwtService, newUser);

    return { message: 'OTP has been sent to your email', newUser, accessToken };
  }

  // Verify OTP
  async verifyOtp(dto: VerifyOtpDto) {
    const { email, otp } = dto;

    if (!email || !otp)
      throw new BadRequestException('Email and OTP are required');

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'otp', 'otpExpiresAt', 'isAccountVerified'],
    });

    if (!user) throw new BadRequestException('User not found');
    if (user.isAccountVerified) return { message: 'Account already verified' };

    if (!user.otp || !user.otpExpiresAt)
      throw new BadRequestException('No OTP found, please request a new one');

    if (user.otpExpiresAt.getTime() < Date.now())
      throw new BadRequestException('OTP has expired, please resend');

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) throw new BadRequestException('Invalid OTP');

    user.isAccountVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await this.userRepository.save(user);

    await this.emailService.sendOtpSuccessEmail({
      to: dto.email,
      subject: 'Your email Verification successful',
    });

    return { message: 'Email verified successfully' };
  }

  // Resend OTP
  async resendOtp(dto: ResendOtpDto) {
    const { email } = dto;

    if (!email) throw new BadRequestException('Email is required');

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'otpExpiresAt', 'isAccountVerified', 'otp'],
    });

    if (!user) throw new BadRequestException('User not found');
    if (user.isAccountVerified) return { message: 'Account already verified' };

    if (
      user.otpExpiresAt &&
      user.otpExpiresAt.getTime() > Date.now() - 60 * 1000
    )
      throw new BadRequestException('Please wait before requesting a new OTP');

    const otp = randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 5);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otpHash;
    user.otpExpiresAt = otpExpiresAt;
    await this.userRepository.save(user);

    await this.emailService.sendOtpEmail({
      to: email,
      otp,
      subject: 'New OTP to Verification Code',
    });

    return { message: 'New OTP has been sent to your email' };
  }


  async login(email: string, password: string) {
    if (!email || !password)
      throw new BadRequestException('Email and password are required');

    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'name',
        'phone',
        'email',
        'password',
        'isAccountVerified',
        'role',
      ],
    });

    if (!user) throw new BadRequestException('Invalid email or password');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid email or password');

    if (!user.isAccountVerified)
      throw new BadRequestException('Please verify your email first');

    const accessToken = await generateAccessToken(this.jwtService, user);

    await this.emailService.sendWelcomeAfterLogin({
      to: email,
      subject: 'email Verification success , hello in EveTix',
    });


    const safeUser = plainToInstance(User, user, {
      excludeExtraneousValues: false,
    });

    return { user: safeUser, accessToken };
  }

  
 
  async sendResetPasswordLink(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new BadRequestException('User with given email does not exist');

    user.resetPasswordToken = randomBytes(32).toString('hex');
    await this.userRepository.save(user);

   
    const link = `${this.config.get<string>('CLIENT_DOMAIN')}/reset-password/${user.id}/${user.resetPasswordToken}`;

    await this.emailService.sendResetPasswordEmail(email, link);

    return {
      message: 'Password reset link has been sent to your email',
    };
  }

  
  async getResetPasswordLink(userId: string, resetPasswordToken: string) {
    const user = await this.userRepository.findOne({
      where: { id: String(userId) },
    });
    if (!user || user.resetPasswordToken !== resetPasswordToken)
      throw new BadRequestException('Invalid link');

    return {
      message: 'Valid link',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { password, userId, resetPasswordToken } = dto;

    const user = await this.userRepository.findOne({
      where: { id: String(userId) },
    });
    if (!user || user.resetPasswordToken !== resetPasswordToken)
      throw new BadRequestException('Invalid link');

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;

    await this.userRepository.save(user);

    return {
      message: 'Password reset successfully, please log in',
    };
  }
}
