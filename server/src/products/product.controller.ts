// product.controller.ts
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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/Guard/Role.Guard';
import { ProductDto } from './dto/ProductDto';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './RequestDto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/multer-config.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(':user_id/create')
  @UseInterceptors(
    FilesInterceptor('image', 5, new MulterConfigService().getConfig()),
  )
  async createProduct(
    @Param('user_id') userId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() product: ProductDto,
  ) {
    return this.productService.createProduct(product, userId, files);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('/:product_id')
  async deleteProduct(
    @Req() req: RequestWithUser,
    @Param('product_id') productId: string,
  ) {
    return this.productService.deleteProduct(productId, req.user.email);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('/:product_id')
  @UseInterceptors(
    FilesInterceptor('image', 5, new MulterConfigService().getConfig()),
  )
  async updateProduct(
    @Req() req: RequestWithUser,
    @Param('product_id') productId: string,
    @Body() product: ProductDto,
    @UploadedFiles() files?: Express.Multer.File[], // Make optional
  ) {
    return this.productService.updateProduct(
      productId,
      product,
      req.user.email,
      files,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/userProducts')
  async getProductsByUserId(@Req() req: RequestWithUser) {
    return this.productService.getProductsByUser(req.user.email);
  }

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }
}
