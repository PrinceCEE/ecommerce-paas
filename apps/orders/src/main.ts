import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GrpcPackageNames } from '@libs/shared';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GrpcPackageNames.ORDER,
      protoPath: join(__dirname, 'orders/order.proto'),
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
