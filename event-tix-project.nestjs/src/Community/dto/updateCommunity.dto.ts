import { PartialType } from '@nestjs/mapped-types';
import { CreateCommunityDto } from './createCommunity.dto';
export class UpdateDtoCommunity extends PartialType(CreateCommunityDto) {}
