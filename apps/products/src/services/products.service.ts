import { Injectable } from '@nestjs/common';
import { OwnerRepository, ProductRepository } from '../repositories';

@Injectable()
export class ProductService {
  constructor(
    private readonly ownerRepository: OwnerRepository,
    private readonly productRepository: ProductRepository,
  ) {}
}
