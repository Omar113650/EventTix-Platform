import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventCategory } from '../Category/entities/Category.entities';
import { CreateEventCategoryDto } from '../Category/dto/CreateCategory.dto';
import { UpdateCategoryDto } from '../Category/dto/UpdateCategory.dto';
import { Between, Like, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(EventCategory)
    private readonly CategoryRepository: Repository<EventCategory>,
  ) {}


  async CreateCategory(createEventCategoryDto: CreateEventCategoryDto) {
    const AddCategory = this.CategoryRepository.create(createEventCategoryDto);
    return await this.CategoryRepository.save(AddCategory);
  }


  async GetAllCategory(Param?: {
    order?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const filterOptions: any = {};

    if (Param?.search) {
      filterOptions.name = Like(`%${Param.search}%`);
    }

    const page = Param?.page ?? 1;
    const limit = Param?.limit ?? 10;
    const skip = (page - 1) * limit;

    const categories = await this.CategoryRepository.find({
      where: filterOptions,
      skip,
      take: limit,
    });

    if (!categories.length) {
      throw new NotFoundException('No categories found');
    }
    return {
      total: categories.length,
      page,
      limit,
      data: categories,
    };
  }


  async GetCategoryById(id: string) {
    const category = await this.CategoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }


  async UpdateCategory(id: string, updateDto: UpdateCategoryDto) {
    const category = await this.CategoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    const updated = await this.CategoryRepository.preload({
      id,
      ...updateDto,
    });

    if (!updated) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return await this.CategoryRepository.save(updated);
  }


  async DeleteCategory(id: string) {
    const category = await this.CategoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return await this.CategoryRepository.remove(category);
  }
}
