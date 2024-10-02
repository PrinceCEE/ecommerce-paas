import { Module } from '@nestjs/common';
import { OrdersHttpController } from './controllers';
import { OrderService } from './services';
import { OrderRepository, ProductRepository } from './repositories';

@Module({
  imports: [],
  controllers: [OrdersHttpController],
  providers: [OrderService, OrderRepository, ProductRepository],
})
export class OrdersModule {}
