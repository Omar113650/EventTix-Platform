import { PartialType } from '@nestjs/mapped-types';
import {CreateEventCategoryDto} from './CreateCategory.dto'
export class UpdateCategoryDto extends PartialType(CreateEventCategoryDto){}


