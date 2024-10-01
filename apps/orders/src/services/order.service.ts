import { Injectable } from '@nestjs/common';
import { OrderRepository, ProductRepository } from '../repositories';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {}
}
