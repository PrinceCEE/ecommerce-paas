import { Controller } from '@nestjs/common';
import { ProductService } from '../services';

@Controller('products')
export class ProductsHttpController {
  constructor(private readonly productService: ProductService) {}
}
