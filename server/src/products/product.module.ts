import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schema/product.model';
import { UserSchema } from 'src/auth/schema/User.model';
import { AuthModule } from 'src/auth/Auth.module';
import { CloudinaryModule } from '../Cloudinary/Cloudinary.Module';
import { MulterConfigService } from 'src/multer-config.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, MulterConfigService],
})
export class ProductModule {}
