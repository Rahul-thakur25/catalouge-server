import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/products/RequestDto';
import { User } from '../auth/schema/User.model'; // Your User model

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
}
