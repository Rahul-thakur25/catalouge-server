import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/products/RequestDto';
import { User } from '../auth/schema/User.model';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async addToCart(
    @Req() req: RequestWithUser,
    @Body() body: { productId: string },
  ) {
    const email = req.user?.email;

    if (!email) {
      throw new UnauthorizedException('User email not found');
    }

    const user: User | null = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { productId } = body;

    const updatedCart = await this.cartService.addToCart(
      user._id.toString(),
      productId,
    );

    return updatedCart;
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('get')
  async getCartItems(@Req() req: RequestWithUser) {
    const email = req.user?.email;

    if (!email) {
      throw new UnauthorizedException('User email not found');
    }

    const user: User | null = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const cartItems = await this.cartService.getCartItems(user._id.toString());
    if (!cartItems) {
      throw new UnauthorizedException('Nothing in the cart');
    }

    return cartItems;
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/remove/:productId')
  async removeCartItem(
    @Req() req: RequestWithUser,
    @Param('productId') productId: string,
  ) {
    const email = req.user.email;
    if (!email) {
      throw new UnauthorizedException('User not found');
    }

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userId = user._id.toString();
    const message = await this.cartService.removeCartItem(userId, productId); // The service returns a string message

    if (!message) {
      throw new UnauthorizedException('Product not found in cart');
    }

    return { message };
  }
}
