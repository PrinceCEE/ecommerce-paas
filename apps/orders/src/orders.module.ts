import { Module } from '@nestjs/common';
import { OrdersGrpcController, OrdersHttpController } from './controllers';
import { OrderService } from './services';
import { OrderRepository, ProductRepository } from './repositories';

@Module({
  imports: [],
  controllers: [OrdersGrpcController, OrdersHttpController],
  providers: [OrderService, OrderRepository, ProductRepository],
})
export class OrdersModule {}
