import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './CreateBookingDto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
