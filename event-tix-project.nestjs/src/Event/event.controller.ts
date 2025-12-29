import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  UseGuards,
  Version,
  ParseUUIDPipe,
  Query,
  Patch,
  UploadedFile,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Roles } from '../decorator/roles/roles.decorator';
import { RolesGuard } from '../Auth/roles/roles.guard';
import { CreateEventDTO } from './dto/createEvent.dto';
import { UpdateDtoEvent } from './dto/updateEvent.dto';

// LlmService ,
// import { LlmService} from '../llm/llm.service';
import{LlmRagService} from '../llm/llm.service'

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService,
        // private readonly llmService: LlmService,
        private readonly llmService: LlmRagService,

  ) {}















  
  @Get('today')
  async getTodaysEvents() {
    const today = new Date();
    const events = await this.eventService.findByDate(today);
    const prompt = `اعرضلي كل الأحداث القادمة اليوم:\n${events
      .map(e => `${e.title} - ${e.location} - ${e.startAt}`)
      .join('\n')}`;
    // return this.llmService.queryWithData(prompt);
    return this.llmService.queryWithRAG(prompt);


  }

  @Get('search')
  async searchEvents(@Query('q') query: string) {
    const relevantEvents = await this.eventService.findByKeyword(query);
    const prompt = `استنادًا للبيانات التالية، أجب على السؤال:\n${relevantEvents
      .map(e => `${e.title} - ${e.description || ''} - ${e.location}`)
      .join('\n')}\nسؤال: ${query}`;
    // return this.llmService.queryWithData(prompt);\
        return this.llmService.queryWithRAG(prompt);
  }
@Post('ask')
  async ask(@Body('prompt') prompt: string) {
    // const answer = await this.llmService.queryWithData(prompt);
    const answer = await this.llmService.queryWithRAG(prompt);

    return { answer };
  }
  // إنشاء حدث

  // @Version('1')
  @Roles('Admin', 'Organizer')
  @UseGuards(RolesGuard)
  @Post('add-event')
  async create(
    @Body() body: CreateEventDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.eventService.createEvent(body, file);
  }

  // جلب كل الأحداث مع فلترة، ترتيب، وباجينايشن
  @Get('get-event')
  @Version('1')
  async getEvents(
    @Query('minprice') minprice?: number,
    @Query('maxprice') maxprice?: number,
    @Query('sortedBy') sortedBy?: 'startAt' | 'price',
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.eventService.getEvents({
      filter: { minprice, maxprice },
      sortedBy,
      order,
      page,
      limit,
      search,
    });
  }

  // جلب حدث بالـ ID
  @Get(':id')
  @Version('1')
  async getEventById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.eventService.getEventById(id);
  }

  // تحديث حدث
  @Patch('update/:id')
  @Version('1')
  @Roles('Admin', 'Organizer')
  @UseGuards(RolesGuard)
  async updateEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateDtoEvent,
  ) {
    return await this.eventService.updateEvent(id, updateDto);
  }

  // حذف حدث
  @Delete('delete/:id')
  @Version('1')
  @Roles('Admin', 'Organizer')
  @UseGuards(RolesGuard)
  async deleteEvent(@Param('id', ParseUUIDPipe) id: string) {
    return await this.eventService.deleteEvent(id);
  }

  //   @Get('cheapest')
  // async getCheapestEvent() {
  //   return this.eventService.getCheapestEvent();
  // }


  








}



