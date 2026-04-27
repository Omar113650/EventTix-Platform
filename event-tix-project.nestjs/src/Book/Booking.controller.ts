import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  Version,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './Booking.service';
import { Roles } from '../decorator/roles/roles.decorator';
import { RolesGuard } from '../Auth/roles/roles.guard';
import { CreateBookingDto } from './dto/CreateBookingDto';
import { UpdateBookingDto } from './dto/UpdateBookingDto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('create-book')
  @Version('1')
  @Roles('Admin', 'Organizer')
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateBookingDto,id:string ) {
    return await this.bookingService.createBooking(dto,id);
  }

  @Get()
  @Version('1')
  async getAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.bookingService.getBookings();
  }

  @Get(':id')
  @Version('1')
  async getById(@Param('id', ParseIntPipe) id: string) {
    return await this.bookingService.getBookingById(id);
  }

  @Put(':id')
  @Version('1')
  @Roles('Admin', 'Organizer')
  @UseGuards(RolesGuard)
  async update(@Param('id', ParseIntPipe) id: string, @Body() dto: UpdateBookingDto) {
    return await this.bookingService.updateBooking(id, dto);
  }

  @Delete(':id')
  @Version('1')
  @Roles('Admin', 'Organizer')
  @UseGuards(RolesGuard)
  async delete(@Param('id', ParseIntPipe) id: string) {
    return await this.bookingService.deleteBooking(id);
  }
}
