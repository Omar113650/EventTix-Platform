import { Injectable, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventCategory } from '../Category/entities/Category.entities';
import { CreateEventCategoryDto } from '../Category/dto/CreateCategory.dto';
import { UpdateCategoryDto } from '../Category/dto/UpdateCategory.dto';
import { Between, Like, Repository } from 'typeorm';
import { Roles } from 'src/decorator/roles/roles.decorator';
import{RolesGuard} from '../Auth/roles/roles.guard'


@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(EventCategory)
    private readonly CategoryRepository: Repository<EventCategory>,
  ) {}

  // CREATE
  async CreateCategory(createEventCategoryDto: CreateEventCategoryDto) {
    const AddEvent = this.CategoryRepository.create(createEventCategoryDto);
    return await this.CategoryRepository.save(AddEvent);
  }
  async GetAllCategory(
  Param?: {
    filter?: {
      minprice?: number;
      maxprice?: number;
    };
    sortedby?: 'name' | 'price';
    order?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
    search?: string;
  },
) {
  const filterOptions: any = {};

  // 🔍  SEARCH
  if (Param?.search) {
    filterOptions.name = Like(`%${Param.search}%`);
  }

  // 🔎  FILTERS (min/max price)
  if (Param?.filter) {
    const { minprice, maxprice } = Param.filter;

    if (minprice !== undefined && maxprice !== undefined) {
      filterOptions.price = Between(minprice, maxprice);
    }
  }

  // 🔽  SORTING
  const sortField = Param?.sortedby ?? 'id';
  const sortOrder = Param?.order ?? 'ASC';

  // 📄  PAGINATION
  const page = Param?.page ?? 1;
  const limit = Param?.limit ?? 10;
  const skip = (page - 1) * limit;

  const categories = await this.CategoryRepository.find({
    where: filterOptions,
    order: {
      [sortField]: sortOrder,
    },
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


  // GET BY ID
  async GetCategoryById(id: string) {
    const category = await this.CategoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  // UPDATE
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

  // DELETE
  async DeleteCategory(id: string) {
    const category = await this.CategoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return await this.CategoryRepository.remove(category);
  }
}
