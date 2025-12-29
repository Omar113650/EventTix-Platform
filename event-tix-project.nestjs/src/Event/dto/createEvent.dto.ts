import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
  IsUUID,
} from 'class-validator';

export class CreateEventDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  Image?: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDate()
  @IsNotEmpty()
  startAt: Date;

  @IsDate()
  @IsNotEmpty()
  endAt: Date;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
