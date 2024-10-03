import { Module } from '@nestjs/common';
import {
  ProductEventsController,
  ProductsGrpcController,
  ProductsHttpController,
} from './controllers';
import { ProductService } from './services';
import { OwnerRepository, ProductRepository } from './repositories';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  GrpcNames,
  GrpcPackageNames,
  QueueNames,
  RabbitMQNames,
} from '@libs/shared';
import { MongooseModule } from '@nestjs/mongoose';
import { Owner, OwnerSchema, Product, ProductSchema } from './schemas';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      {
        name: Owner.name,
        schema: OwnerSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: GrpcNames.OWNER,
        transport: Transport.GRPC,
        options: {
          package: GrpcPackageNames.OWNER,
          protoPath: join(process.cwd(), 'protos/owner.proto'),
          url: process.env.OWNERS_GRPC_URL,
        },
      },
      {
        name: RabbitMQNames.PRODUCT,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: QueueNames.PRODUCT,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [
    ProductsGrpcController,
    ProductsHttpController,
    ProductEventsController,
  ],
  providers: [ProductService, ProductRepository, OwnerRepository],
})
export class ProductsModule {}
