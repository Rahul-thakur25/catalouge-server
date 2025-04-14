import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductDto } from './dto/ProductDto';
import { Model } from 'mongoose';
import { Product } from './schema/product.model';
import { User } from 'src/auth/schema/User.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async createProduct(product: ProductDto, userId: string): Promise<Product> {
    try {
      const newProduct = new this.productModel({
        ...product,
        user: userId,
      });
      await newProduct.save();

      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.products.push(newProduct._id as Types.ObjectId);
      await user.save();
      return newProduct;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating product: ${error}`,
      );
    }
  }
  async deleteProduct(productId: string, email: string): Promise<Product> {
    try {
      // Fetch the user by email
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!user._id) {
        throw new InternalServerErrorException('User ID is missing');
      }
      user.products = user.products.filter(
        (product) => product.toString() !== productId,
      );
      await user.save();
      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
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
  async updateProduct(product_id: string, product: ProductDto, email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const existingProduct = await this.productModel.findById(product_id);
      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }

      // Authorization check
      if (existingProduct.user.toString() !== user._id.toString()) {
        throw new InternalServerErrorException(
          'User is not authorized to update this product',
        );
      }

      // Now safe to update
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        product_id,
        product,
        { new: true },
      );

      return updatedProduct;
    } catch (error) {
      console.error('Update Product Error:', error);
      throw new InternalServerErrorException(
        `Error updating product: ${error}`,
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

      if (
        !userWithProducts.products ||
        userWithProducts.products.length === 0
      ) {
        throw new NotFoundException('No products found for this user');
      }

      return userWithProducts.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new InternalServerErrorException(
        `Error fetching products: ${error}`,
      );
    }
  }
  async getAllProducts() {
    try {
      const products = await this.productModel.find();
      if (!products || products.length === 0) {
        throw new NotFoundException('No products found');
      }
      return products;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw new InternalServerErrorException(
        `Error fetching all products: ${error}`,
      );
    }
  }
}
