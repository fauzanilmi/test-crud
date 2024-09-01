import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column()
  @IsNotEmpty()
  @IsString()
  sku: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column('text')
  description: string;

  @Column()
  weight: number;

  @Column()
  width: number;

  @Column()
  length: number;

  @Column()
  height: number;

  @Column()
  stock: number;

  @Column()
  image: string;

  @Column('int')
  price: number;
}
