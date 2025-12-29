import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommunityDto {
  @ApiProperty({ example: 'Sports Lovers' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({ example: 'A community for people who love sports.' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @IsString()
  @IsOptional()
  feedbackThisCommunity?:string

  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  createdAt?: Date;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  updatedAt?: Date;
}
