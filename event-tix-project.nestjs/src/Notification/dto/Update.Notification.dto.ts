import { PartialType } from '@nestjs/swagger';
import {CreateNotificationDto} from './Create.Notification.dto'


export class UpdateNotificationDto extends PartialType(CreateNotificationDto){}