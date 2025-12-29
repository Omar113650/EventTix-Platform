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

  // CREATE
  @Post('add-category')
  // @Version('1')
  @Roles('Admin', 'Organizer')
  @UseGuards(RolesGuard)
  async create(@Body() body: CreateEventCategoryDto) {
    return await this.categoryService.CreateCategory(body);
  }

  // GET ALL
  @Get('Get-All-Category')
  @Version('1')
  @Roles('Admin', 'Organizer', 'User')
  @UseGuards(RolesGuard)
  async findAllCategories(
    @Query('minprice') minprice?: number,
    @Query('maxprice') maxprice?: number,
    @Query('sortedby') sortedby?: 'name' | 'price',
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.categoryService.GetAllCategory({
      filter: {
        minprice: minprice ? Number(minprice) : undefined,
        maxprice: maxprice ? Number(maxprice) : undefined,
      },
      sortedby,
      order,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
    });
  }

  // GET ONE BY ID
  @Get(':id')
  @Version('1')
  @Roles('Admin', 'Organizer', 'User')
  @UseGuards(RolesGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoryService.GetCategoryById(id);
  }

  // UPDATE
  @Patch('update/:id')
  @Version('1')
  @Roles('Admin', 'Organizer', 'User')
  @UseGuards(RolesGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.UpdateCategory(id, updateCategoryDto);
  }

  // DELETE
  @Delete('delete/:id')
  @Version('1')
  @Roles('Admin')
  @UseGuards(RolesGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoryService.DeleteCategory(id);
  }
}
