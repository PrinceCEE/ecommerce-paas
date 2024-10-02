import { Module } from '@nestjs/common';
import { ProductsGrpcController, ProductsHttpController } from './controllers';
import { ProductService } from './services';
import { OwnerRepository, ProductRepository } from './repositories';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcNames, GrpcPackageNames } from '@libs/shared';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: GrpcNames.OWNER,
        transport: Transport.GRPC,
        options: {
          package: GrpcPackageNames.OWNER,
          protoPath: join(__dirname, 'owner/owner.proto'),
        },
      },
    ]),
  ],
  controllers: [ProductsGrpcController, ProductsHttpController],
  providers: [ProductService, ProductRepository, OwnerRepository],
})
export class ProductsModule {}
