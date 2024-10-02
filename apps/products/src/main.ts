import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductsModule } from './products.module';
import { GrpcPackageNames } from '@libs/shared';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {},
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GrpcPackageNames.PRODUCT,
      protoPath: join(__dirname, 'products/product.proto'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
