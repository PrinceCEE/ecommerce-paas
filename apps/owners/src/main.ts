import { NestFactory } from '@nestjs/core';
import { OwnersModule } from './owners.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(OwnersModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {},
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: '',
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
