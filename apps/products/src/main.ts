import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductsModule } from './products.module';
import { GrpcPackageNames, QueueNames } from '@libs/shared';
import { join } from 'path';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      transform: true,
      whitelist: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: QueueNames.OWNER,
      queueOptions: {
        durable: true,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GrpcPackageNames.PRODUCT,
      protoPath: join(process.cwd(), 'protos/product.proto'),
      url: process.env.PRODUCTS_GRPC_URL,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
