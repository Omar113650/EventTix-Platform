import { CreateEventDTO } from './createEvent.dto';

import { PartialType } from '@nestjs/mapped-types';

export class UpdateDtoEvent extends PartialType(CreateEventDTO) {}
