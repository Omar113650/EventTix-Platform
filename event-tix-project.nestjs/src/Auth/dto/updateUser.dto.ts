import { PartialType } from '@nestjs/mapped-types';
import {CreateUserDto} from './createUser.dto'
export class UpdateDtoUser extends PartialType(CreateUserDto){}


