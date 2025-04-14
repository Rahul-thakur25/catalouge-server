import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Req,
  Patch,
  Get,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/Guard/Role.Guard';
import { ProductDto } from './dto/ProductDto';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './RequestDto';
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(':user_id/create')
  async createProduct(
    @Param('user_id') userId: string,
    @Body() product: ProductDto,
  ) {
    try {
      const newProduct = await this.productService.createProduct(
        product,
        userId,
      );
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error(`Error creating product: ${error}`);
    }
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('/:product_id')
  async deleteProduct(
    @Req() req: RequestWithUser,
    @Param('product_id') productId: string,
  ) {
    const user = req.user;
    try {
      const deletedProduct = await this.productService.deleteProduct(
        productId,
        user.email,
      );
      return deletedProduct;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error(`Error deleting product: ${error}`);
    }
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('/:product_id')
  async updateProduct(
    @Req() req: RequestWithUser,
    @Param('product_id') productId: string,
    @Body() product: ProductDto,
  ) {
    try {
      const email = req.user.email;
      const updatedProduct = await this.productService.updateProduct(
        productId,
        product,
        email,
      );
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error(`Error updating product: ${error}`);
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/userProducts')
  async getProductsByUserId(@Req() req: RequestWithUser) {
    try {
      const email = req.user.email;
      const products = await this.productService.getProductsByUser(email);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error(`Error fetching products: ${error}`);
    }
  }
  @Get()
  async getAllProducts() {
    try {
      const products = await this.productService.getAllProducts();
      return products;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw new Error(`Error fetching all products: ${error}`);
    }
  }
}
