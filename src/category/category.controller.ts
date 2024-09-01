import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() category: Category): Promise<Category> {
    return this.categoryService.create(category);
  }

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() category: Category): Promise<Category> {
    return this.categoryService.update(id, category);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string; category: Category}> {
    const category = await this.categoryService.remove(id);

    return {
      message: "Category deleted successfully",
      category,
    };
  }
}