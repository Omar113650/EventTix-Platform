import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
  Version,
  ParseIntPipe,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from '../decorator/roles/roles.decorator';
import { RolesGuard } from '../Auth/roles/roles.guard';
import { CreateEventCategoryDto } from './dto/CreateCategory.dto';
import { UpdateCategoryDto } from './dto/UpdateCategory.dto';

@Controller('/api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('add-category')
  @Version('1')
  @Roles('Admin', 'Organizer')
  @UseGuards(RolesGuard)
  async create(@Body() body: CreateEventCategoryDto) {
    return await this.categoryService.CreateCategory(body);
  }

  @Get('Get-All-Category')
  @Version('1')
  async findAllCategories(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.categoryService.GetAllCategory({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
    });
  }

  @Get(':id')
  @Version('1')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoryService.GetCategoryById(id);
  }

  @Patch('update/:id')
  @Version('1')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.UpdateCategory(id, updateCategoryDto);
  }

  @Delete('delete/:id')
  @Version('1')
  @Roles('Admin', 'Organizer')
  @UseGuards(RolesGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoryService.DeleteCategory(id);
  }
}
