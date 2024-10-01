import { Module } from '@nestjs/common';
import { ProductsGrpcController, ProductsHttpController } from './controllers';
import { ProductService } from './services';
import { OwnerRepository, ProductRepository } from './repositories';

@Module({
  imports: [],
  controllers: [ProductsGrpcController, ProductsHttpController],
  providers: [ProductService, ProductRepository, OwnerRepository],
})
export class ProductsModule {}
