import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';;
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { Express } from 'express';
import { validate } from 'class-validator';
import * as fs from 'fs';
import * as path from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<{ productData: Product[]; total: number; page: number; limit: number }> {
    const result = await this.productsService.findAll(page, limit);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    const result = await this.productsService.findOne(id);

    return result;
  }

  @Put(':id')
  @UseInterceptors(getFileUploadConfig('image'))
  async update(
    @Param('id') id: number, 
    @Body() product: Product,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    try {
      const productData = await imageAndValidation(file, product);
      return this.productsService.update(id, productData);
    } catch (error) {
      console.error('An error occurred while updating product:', error);
      throw new BadRequestException('An error occurred while updating product');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string; product: Product}> {
    const product = await this.productsService.remove(id);

    return {
      message: "Product deleted successfully",
      product,
    };
  }

  @Post()
  @UseInterceptors(getFileUploadConfig('image'))
  async create(
    @Body() product: Product,
    @UploadedFile(
    ) file: Express.Multer.File,
  ): Promise<Product> {
    const productData = await imageAndValidation(file, product);

    return this.productsService.create(productData);
  }
  
  
}


async function imageAndValidation(file: Express.Multer.File, product: Product) {
  let imageUrl = null;
  let productData;

  if (file != null) {
    imageUrl = 'uploads/' + file.filename;

    productData = plainToInstance(Product, {
      ...product,
      image: imageUrl,
    });
  } else {
    productData = plainToInstance(Product, {
      ...product,
    });
  }

  const errors = await validate(productData);
  if (errors.length > 0) {
    if (file != null) {
      fs.unlink(path.join("uploads/" + file.filename), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    throw new BadRequestException('Validation failed: ' + errors.toString());
  }
  return productData;
}

function getFileUploadConfig(type: string) {
  return FileInterceptor(type, {
    storage: diskStorage({
      destination: './uploads',
      filename(req, file, callback) {
        const fileName = req.body.name;
        const uniqueName = uuidv4();
        callback(
          null,
          `${fileName}-${uniqueName}${extname(file.originalname)}`
        );
      },
    }),
  });


}
