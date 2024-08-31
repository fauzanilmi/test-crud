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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './products.entity';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { Express } from 'express';
import { validate } from 'class-validator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  // @Post()
  // async create(@Body() product: Product): Promise<Product> {
  //   return this.productsService.create(product);
  // }

  @Put(':id')
  update(@Param('id') id: number, @Body() product: Product): Promise<Product> {
    return this.productsService.update(id, product);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.productsService.remove(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename(req, file, callback) {
          const fileName = req.body.name;
          const uniqueName = uuidv4();
          callback(
            null,
            `${fileName}-${uniqueName}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async createWithImage(
    @Body() product: Product,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    const imageUrl = 'uploads/' + file.filename;
    const productData = plainToInstance(Product, {
      ...product,
      image: imageUrl,
    });

    const errors = await validate(productData);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed: ' + errors.toString());
    }

    return this.productsService.create(productData);
  }
}
