import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Version,
  Patch,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { Roles } from '../decorator/roles/roles.decorator';
import { RolesGuard } from '../Auth/roles/roles.guard';
import { CreateCommunityDto } from './dto/createCommunity.dto';
import { UpdateDtoCommunity } from './dto/updateCommunity.dto';
import { AddCommentDTO } from './dto/AddComment.dto';
import { AddCommunityFeedbackDto } from './dto/AddFeedback.dto';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('create-community')
  @Version('1')
  @Roles('Admin', 'Organizer')
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateCommunityDto) {
    return await this.communityService.createCommunity(dto);
  }
  @Get('get-event')
  @Version('1')
  @Roles('Admin', 'Organizer', 'User')
  @UseGuards(RolesGuard)
  async getAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.communityService.getCommunities({ page, limit, search });
  }

  @Get('get/:id')
  @Version('1')
  @Roles('Admin', 'Organizer', 'User')
  @UseGuards(RolesGuard)
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.communityService.getCommunityById(id);
  }

  @Put('update/:id')
  @Version('1')
  @Roles('Admin', 'Organizer')
  @UseGuards(RolesGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDtoCommunity,
  ) {
    return await this.communityService.updateCommunity(id, dto);
  }

  @Delete('delete/:id')
  @Version('1')
  @Roles('Admin', 'Organizer')
  @UseGuards(RolesGuard)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.communityService.deleteCommunity(id);
  }
  @Roles('User')
  @UseGuards(RolesGuard)
  @Patch('comment/:id')
  @Version('1')
  addComment(@Param('id') id: string, @Body() dto: AddCommentDTO) {
    return this.communityService.addCommentInEvent(dto, id);
  }
  @Roles('User')
  @UseGuards(RolesGuard)
  @Version('1')
  @Patch('feedback/:id')
  addFeedback(@Param('id') id: string, @Body() dto: AddCommunityFeedbackDto) {
    return this.communityService.addFeedbackThisCommunity(dto, id);
  }
}
