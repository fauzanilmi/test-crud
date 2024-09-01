import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

const NOT_FOUND = 'Category not found';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  
  async create(category: Category): Promise<Category> {
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    const category = await this.categoryRepository.find();
    if (category.length == 0) {
      throw new NotFoundException(NOT_FOUND);
    }
    return category;
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(NOT_FOUND);
    }
    return category;
  }

  async update(id: number, category: Category): Promise<Category> {
    const existingCategory = await this.findOne(id);
  
    if (!existingCategory) {
      throw new NotFoundException(NOT_FOUND);
    }

    try {
      await this.categoryRepository.update(id, category);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while updating category');
    }
    
    return {...existingCategory, ...category};
  }

  async remove(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    
    if (!category) {
      throw new NotFoundException(NOT_FOUND);
    }

    await this.categoryRepository.delete(id);

    return category;
  }
}
