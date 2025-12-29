import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entities';

export class CreateUserDto {
  @ApiPropertyOptional({
    description: 'Profile image URL',
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsString()
  profileImage?: Express.Multer.File;

  @ApiProperty({ example: 'Omar Elhelaly' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(40)
  name: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    example: UserRole.User,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ example: 'omar@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Omar@669696' })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/, {
    message: 'Password must contain uppercase, lowercase, number and symbol',
  })
  password: string;

  @ApiPropertyOptional({ example: '01095496184' })
  @IsOptional()
  @IsPhoneNumber('EG')
  phone?: string;

  @ApiPropertyOptional({ example: 'Aga' })
  @IsOptional()
  @IsString()
  address?: string;
}
