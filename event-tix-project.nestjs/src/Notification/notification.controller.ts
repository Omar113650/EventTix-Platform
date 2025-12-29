// src/notification/notification.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/Create.Notification.dto';
import { UpdateNotificationDto } from './dto/Update.Notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // @Post()
  // create(@Body() dto: CreateNotificationDto) {
  //   return this.notificationService.create(dto);
  // }

  @Get('notification')
  findAll() {
    return this.notificationService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.notificationService.findOne(id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateNotificationDto) {
  //   return this.notificationService.update(id, dto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notificationService.remove(id);
  // }
}
