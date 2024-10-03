import { Module } from '@nestjs/common';
import { OrdersHttpController } from './controllers';
import { OrderService } from './services';
import { OrderRepository, ProductRepository } from './repositories';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Order,
  OrderItem,
  OrderItemSchema,
  OrderSchema,
  Product,
  ProductSchema,
} from './schemas';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  GrpcNames,
  GrpcPackageNames,
  QueueNames,
  RabbitMQNames,
} from '@libs/shared';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: OrderItem.name,
        schema: OrderItemSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: GrpcNames.PRODUCT,
        transport: Transport.GRPC,
        options: {
          package: GrpcPackageNames.PRODUCT,
          protoPath: join(process.cwd(), 'protos/product.proto'),
        },
      },
      {
        name: RabbitMQNames.PRODUCT,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: QueueNames.PRODUCT,
        },
      },
    ]),
  ],
  controllers: [OrdersHttpController],
  providers: [OrderService, OrderRepository, ProductRepository],
})
export class OrdersModule {}
