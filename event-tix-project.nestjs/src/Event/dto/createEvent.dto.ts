import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
  IsUUID,
  IsEnum,
  Min,
  Max,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export enum PriceType {
  PAID = 'paid',
  FREE = 'free',
}

export class CreateEventDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  Image?: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  location: string;

  @IsDate()
  @IsNotEmpty()
  startAt: Date;

  @IsDate()
  @IsNotEmpty()
  endAt: Date;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(10000)
  capacity: number;

  @IsEnum(PriceType)
  priceType: PriceType;

  @ValidateIf((o) => o.priceType === PriceType.PAID)
  @IsNumber()
  @Min(1) // أقل سعر 1
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  comment?: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
