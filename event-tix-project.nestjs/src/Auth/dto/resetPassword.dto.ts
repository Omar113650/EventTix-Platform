import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  // @Min(0)
  @ApiProperty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  resetPasswordToken: string;
}


