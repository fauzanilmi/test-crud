import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';;
import { Repository } from 'typeorm';

const NOT_FOUND = 'Product not found';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{productData: Product[]; total: number; page:number; limit: number}> {
    const [productData, total] = await this.productRepository.findAndCount({
      select: ['id', 'sku', 'name', 'description', 'image'],
      skip: page > 0 ? (page - 1) * limit : 0,
      take: limit,
    });
    
    if (productData.length == 0) {
      throw new NotFoundException(NOT_FOUND);
    }

    return {
      productData,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id })
    if (!product) {
      throw new NotFoundException(NOT_FOUND);
    }
    return product;
  }

  create(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }

  async update(id: number, product: Product): Promise<Product> {
    const existingProduct = await this.findOne(id);
  
    if (!existingProduct) {
      throw new NotFoundException(NOT_FOUND);
    }

    try {
      await this.productRepository.update(id, product);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while updating product');
    }
    
    return {...existingProduct, ...product};
  }

  async remove(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    
    if (!product) {
      throw new NotFoundException(NOT_FOUND);
    }

    await this.productRepository.delete(id);

    return product;
  }
}
