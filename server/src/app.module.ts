import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/Auth.module';
import { ProductModule } from './products/product.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Rahul:Rahul123@backend.l1dj6.mongodb.net/?retryWrites=true&w=majority&appName=backend', // Hardcoded MongoDB URI
    ),
    AuthModule,
    ProductModule,
  ],
})
export class AppModule {}
