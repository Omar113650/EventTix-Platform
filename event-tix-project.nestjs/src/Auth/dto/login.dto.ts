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

export class LoginDto {
  @ApiProperty({ example: 'omar@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Omar@669696' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/, {
    message: 'Password must contain uppercase, lowercase, number and symbol',
  })
  
  password: string;
}
