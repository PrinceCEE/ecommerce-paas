import { Controller } from '@nestjs/common';
import { ProductService } from '../services';
import { GrpcMethod } from '@nestjs/microservices';
import { GetProductsRequest } from '@libs/shared';

@Controller()
export class ProductsGrpcController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'GetProducts')
  async getProducts(data: GetProductsRequest) {
    const response = await this.productService.getProducts({
      productIds: data.ids,
    });

    return { products: response.data.products };
  }
}
