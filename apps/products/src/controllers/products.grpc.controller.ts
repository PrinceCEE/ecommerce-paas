import { Controller } from '@nestjs/common';
import { ProductService } from '../services';

@Controller()
export class ProductsGrpcController {
  constructor(private readonly productService: ProductService) {}

  async findOne() {}

  async findAll() {}
}
