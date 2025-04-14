import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schema/CartSchema';

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private cartModel: Model<Cart>) {}

  async addToCart(userId: string, productId: string): Promise<Cart> {
    let cart = await this.cartModel.findOne({ user: userId });
    const quantity: number = 1;
    if (!cart) {
      cart = new this.cartModel({
        user: userId,
        products: [{ productId, quantity }],
      });
    } else {
      const existingProduct = cart.products.find(
        (p) => p.productId.toString() === productId,
      );
      if (existingProduct) {
        existingProduct.quantity = existingProduct.quantity + quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    return cart.save();
  }
}
