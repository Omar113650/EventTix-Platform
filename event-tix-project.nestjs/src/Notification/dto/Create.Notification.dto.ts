// src/notification/dto/create-notification.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDate,
} from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsDate()
  expiresAt: Date;

  @IsUUID()
  userId: string;

  @IsUUID()
  @IsOptional()
  eventId?: string;
}
