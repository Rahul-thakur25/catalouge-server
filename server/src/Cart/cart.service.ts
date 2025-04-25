import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Cart } from './schema/CartSchema';

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private cartModel: Model<Cart>) {}

  async addToCart(userId: string, productId: string): Promise<Cart> {
    const quantity = 1;
    let cart = await this.cartModel.findOne({ user: userId });

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
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    return await cart.save();
  }

  async getCartItems(userId: string): Promise<Cart> {
    try {
      const cart = await this.cartModel
        .findOne({ user: userId })
        .populate('products.productId');

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      return cart;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw new InternalServerErrorException('Failed to fetch cart items');
    }
  }
  async removeCartItem(userId: string, productId: string): Promise<string> {
    const cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const productIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId,
    );

    if (productIndex === -1) {
      throw new NotFoundException('Product not found in cart');
    }

    const product = cart.products[productIndex];
    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      cart.products.splice(productIndex, 1);
    }
    if (cart.products.length === 0) {
      await this.cartModel.deleteOne({ user: userId });
    } else {
      await cart.save();
    }

    return 'Product removed from cart';
  }
}
