import { Controller } from '@nestjs/common';
import { OrderService } from '../services';

@Controller('owners')
export class OrdersHttpController {
  constructor(private readonly orderService: OrderService) {}
}
