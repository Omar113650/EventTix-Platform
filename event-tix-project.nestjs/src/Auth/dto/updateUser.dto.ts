import { PartialType } from '@nestjs/mapped-types';
import {CreateUserDto} from './createUser.dto'
export class UpdateDtoUser extends PartialType(CreateUserDto){}


// 1. PartialType

// دي utility function جاية من مكتبة @nestjs/mapped-types.

// وظيفتها إنها تعمل نسخة جديدة من DTO لكن تخلي كل الحقول بتاعته اختيارية (optional).