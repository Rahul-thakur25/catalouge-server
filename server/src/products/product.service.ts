// product.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { Types, Model } from 'mongoose';
import { ProductDto } from './dto/ProductDto';
import { Product } from './schema/product.model';
import { User } from 'src/auth/schema/User.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async createProduct(
    product: ProductDto,
    userId: string,
    files?: Express.Multer.File[],
  ): Promise<Product> {
    try {
      if (!files || files.length === 0) {
        throw new NotFoundException('No images found');
      }

      const imageUrls = files.map((file) => file.path);

      const newProduct = new this.productModel({
        ...product,
        images: imageUrls,
        user: userId,
      });

      await newProduct.save();

      const user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException('User not found');

      user.products.push(newProduct._id as Types.ObjectId);
      await user.save();

      return newProduct;
    } catch (error) {
      console.error('Create Product Error:', error);
      throw new InternalServerErrorException(
        `Error creating product: ${error}`,
      );
    }
  }

  async deleteProduct(productId: string, email: string): Promise<Product> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) throw new NotFoundException('User not found');

      user.products = user.products.filter(
        (product) => product.toString() !== productId,
      );
      await user.save();

      const product = await this.productModel.findById(productId);
      if (!product) throw new NotFoundException('Product not found');

      if (product.user.toString() !== user._id.toString()) {
        throw new NotFoundException(
          'User not authorized to delete this product',
        );
      }

      await this.productModel.deleteOne({ _id: productId });
      return product;
    } catch (error) {
      console.error('Delete Product Error:', error);
      throw new InternalServerErrorException(
        `Error deleting product: ${error}`,
      );
    }
  }

  async updateProduct(
    productId: string,
    product: ProductDto,
    email: string,
    files?: Express.Multer.File[],
  ) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const existingProduct = await this.productModel.findById(productId);
      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }
      if (existingProduct.user.toString() !== user._id.toString()) {
        throw new NotFoundException(
          'User not authorized to update this product',
        );
      }

      const updateData: any = { ...product };

      if (files && files.length > 0) {
        updateData.images = files.map((file) => file.path);
      }

      const updatedProduct = await this.productModel.findByIdAndUpdate(
        productId,
        updateData,
        { new: true },
      );

      return updatedProduct;
    } catch (error) {
      console.error('Update Product Error:', error);
      throw new InternalServerErrorException(
        error instanceof HttpException
          ? error.getResponse()
          : 'Failed to update product',
      );
    }
  }

  async getProductsByUser(email: string) {
    try {
      const userWithProducts = await this.userModel
        .findOne({ email })
        .populate('products')
        .exec();

      if (!userWithProducts) {
        throw new NotFoundException('User not found');
      }

      return userWithProducts.products || [];
    } catch (error) {
      console.error('Get Products Error:', error);
      throw new InternalServerErrorException(
        `Error fetching products: ${error.message}`,
      );
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await this.productModel.find();
      if (!products.length) throw new NotFoundException('No products found');
      return products;
    } catch (error) {
      console.error('Get All Products Error:', error);
      throw new InternalServerErrorException(
        `Error fetching all products: ${error}`,
      );
    }
  }
}
