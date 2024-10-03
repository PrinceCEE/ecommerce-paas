import { EventPattern } from '@nestjs/microservices';
import { ProductRepository } from '../repositories';
import { EventNames } from '@libs/shared';
import { ProductResponse } from '../types';
import { Controller } from '@nestjs/common';

@Controller()
export class OrdersEventsController {
  constructor(private readonly productRepository: ProductRepository) {}

  @EventPattern(EventNames.PRODUCT_UPDATED)
  async handleProductUpdated(data: ProductResponse) {
    const { id, ..._data } = data;

    const product = await this.productRepository.findOne(id);
    if (!product) {
      this.productRepository.create(data);
      return;
    }

    this.productRepository.update(id, _data);
  }
}
