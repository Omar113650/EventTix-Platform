// src/notification/dto/create-notification.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

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

  @IsUUID()
  userId: string;

  @IsUUID()
  @IsOptional()
  eventId?: string;
}
