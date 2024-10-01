import { Controller } from '@nestjs/common';
import { OrderService } from '../services';

@Controller()
export class OrdersGrpcController {
  constructor(private readonly orderService: OrderService) {}

  async findOne() {}

  async findAll() {}
}
