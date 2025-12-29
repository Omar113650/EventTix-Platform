import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ enum: ['confirmed', 'waiting'], default: 'waiting' })
  @IsOptional()
  @IsEnum(['confirmed', 'waiting'] as const)
  status?: 'confirmed' | 'waiting';

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  seats: number;

  @ApiProperty({ example: 200.5 })
  @IsNotEmpty()
  totalPrice: number;
}
