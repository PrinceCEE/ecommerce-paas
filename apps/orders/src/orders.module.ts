import { Module } from '@nestjs/common';
import { OrdersEventsController, OrdersHttpController } from './controllers';
import { CacheService, OrderService } from './services';
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
import { GrpcNames, GrpcPackageNames } from '@libs/shared';
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
          url: process.env.PRODUCTS_GRPC_URL,
        },
      },
    ]),
  ],
  controllers: [OrdersHttpController, OrdersEventsController],
  providers: [OrderService, OrderRepository, ProductRepository, CacheService],
})
export class OrdersModule {}
