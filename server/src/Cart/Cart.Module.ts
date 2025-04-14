import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './schema/CartSchema';
import { CartController } from './Cart.controller';
import { CartService } from './cart.service';
import { UserSchema } from '../auth/schema/User.model'; // Assuming a User schema exists

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
