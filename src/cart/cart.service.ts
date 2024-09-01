import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartStatus } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,

        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,

        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    private generateOrderId(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    async createCart(userId: number): Promise<Cart> {
        const orderId = this.generateOrderId();
        const cart = this.cartRepository.create({ userId, orderId, totalPrice: 0  });
        return this.cartRepository.save(cart);
    }

    async getCartByOrderId(orderId: string): Promise<Cart> {
        return this.cartRepository.findOne({
            where: { orderId },
            relations: ['items', 'items.product'],
        });
    }

    async addToCart(userId: number, items: { productId: number; quantity: number }[]): Promise<Cart> {
        let cart = await this.cartRepository.findOne({
            where: { userId, status: CartStatus.CREATED },
            relations: ['items', 'items.product'], 
        });
    
        if (!cart) {
            cart = await this.createCart(userId);
            cart.items = [];
        }

        if (cart.status === CartStatus.COMPLETED) {
            throw new BadRequestException('Cart is completed');
        }
    
        for (const item of items) {
            const product = await this.productRepository.findOne({ where: { id: item.productId } });
            if (!product) {
                throw new BadRequestException(`Product with ID ${item.productId} not found`);
            }
    
            let cartItem = cart.items.find(i => i.product.id === item.productId);
    
            if (cartItem) {
                cartItem.quantity += item.quantity;
            } else {
                cartItem = this.cartItemRepository.create({ cart, product, quantity: item.quantity });
                cart.items.push(cartItem); 
            }
    
            await this.cartItemRepository.save(cartItem);
        }
    
        let totalPrice = 0;
        cart.items.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });
    
        cart.totalPrice = totalPrice;
        await this.cartRepository.save(cart);
    
        return this.getCartByOrderId(cart.orderId);
    }

    async deleteCartItem(orderId: string, cartItemId: number): Promise<Cart> {
        const cart = await this.getCartByOrderId(orderId);
        if (!cart) {
          throw new NotFoundException('Cart not found');
        }
        
        await this.cartItemRepository.delete(cartItemId);
        let totalPrice = 0;
        cart.items = cart.items.filter(item => item.id !== cartItemId);
        cart.items.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });

        cart.totalPrice = totalPrice;
        await this.cartRepository.save(cart);

        return this.getCartByOrderId(orderId);
    }

    async deleteCart(orderId: string): Promise<Cart> {
        const cart = await this.getCartByOrderId(orderId);
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        await this.cartItemRepository.delete({ cart: { id: cart.id } });
        await this.cartRepository.delete({ orderId });
        
        return cart;
    }

    async checkout(orderId: string): Promise<Cart> {
        const cart = await this.getCartByOrderId(orderId);

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
    
        if (cart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }
    
        if (cart.status === CartStatus.COMPLETED) {
            throw new BadRequestException('Cart is completed');
        }
    

        await this.cartRepository.update(
            { orderId: orderId },
            { 
                status: CartStatus.COMPLETED
            }
        );
    
        return { ...cart, status: CartStatus.COMPLETED };
      }

}
