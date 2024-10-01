import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: '',
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
