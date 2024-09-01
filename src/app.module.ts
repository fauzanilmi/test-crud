import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: +'5432',
      username: 'postgres',
      password: 'postgres',
      database: 'convenience_store',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProductsModule,
    CategoryModule,
    CartModule,
  ],
})
export class AppModule {}
