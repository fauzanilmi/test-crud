import { Controller, Post, Get, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('items') items: { productId: number; quantity: number }[],
  ) {
    return this.cartService.addToCart(userId, items);
  }

  @Get(':orderId')
  async getCart(@Param('orderId') orderId: string) {
    return this.cartService.getCartByOrderId(orderId);
  }

  @Delete(':orderId/item/:cartItemId')
  async deleteCartItem(
    @Param('orderId') orderId: string,
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
  ) {
    return this.cartService.deleteCartItem(orderId, cartItemId);
  }

  @Delete(':orderId')
  async deleteCart(
    @Param('orderId') orderId: string,
  ) {
    return this.cartService.deleteCart(orderId);
  }

  @Post('checkout')
  async checkout(
    @Body('orderId') orderId: string,
  ) {
    return this.cartService.checkout(orderId);
  }
}