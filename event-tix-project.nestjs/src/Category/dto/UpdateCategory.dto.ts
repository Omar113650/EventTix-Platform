import { PartialType } from '@nestjs/mapped-types';
import {CreateEventCategoryDto} from './CreateCategory.dto'
export class UpdateCategoryDto extends PartialType(CreateEventCategoryDto){}


// 1. PartialType

// دي utility function جاية من مكتبة @nestjs/mapped-types.

// وظيفتها إنها تعمل نسخة جديدة من DTO لكن تخلي كل الحقول بتاعته اختيارية (optional).