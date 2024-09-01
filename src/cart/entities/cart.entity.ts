import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { CartItem } from './cart-item.entity';

export enum CartStatus {
    CREATED = 'CREATED',
    COMPLETED = 'COMPLETED',
  }

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ unique: true })
  orderId: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];

  @Column()
  totalPrice: number;

  @Column({ type: 'enum', enum: CartStatus, default: CartStatus.CREATED })
  status: CartStatus;
}
