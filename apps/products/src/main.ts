import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductsModule } from './products.module';
import { GrpcPackageNames, QueueNames } from '@libs/shared';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: QueueNames.PRODUCT,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GrpcPackageNames.PRODUCT,
      protoPath: join(process.cwd(), 'protos/product.proto'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
