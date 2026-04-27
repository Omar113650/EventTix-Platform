import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entities';
import { Community } from '../Community/entities/community.entities';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import{GoogleStrategy} from './strategies/google.strategy'
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Community]), 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    EmailModule,
    CloudinaryModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,GoogleStrategy],
   exports: [JwtModule,AuthService]
})
export class AuthModule {}
