import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProductService } from '../services';
import { CreateProductDto, GetProductsDto, UpdateProductDto } from '../dtos';
import { ParseMongoDBID } from '@libs/shared';

@Controller('products')
export class ProductsHttpController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() createproductDto: CreateProductDto) {
    const data = await this.productService.createProduct(createproductDto);
    return data;
  }

  @Put(':id')
  async updateProduct(
    @Param('id', ParseMongoDBID) productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const data = await this.productService.updateProduct(
      productId,
      updateProductDto,
    );
    return data;
  }

  @Get(':id')
  async getOneProduct(@Param('id', ParseMongoDBID) productId: string) {
    const data = await this.productService.getOneProduct(productId);
    return data;
  }

  @Get()
  async getProducts(@Query() getProductsQuery: GetProductsDto) {
    const data = await this.productService.getProducts(getProductsQuery);
    return data;
  }
}
