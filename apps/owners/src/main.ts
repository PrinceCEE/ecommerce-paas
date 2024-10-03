import { NestFactory } from '@nestjs/core';
import { OwnersModule } from './owners.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { GrpcPackageNames, QueueNames } from '@libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(OwnersModule);
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: QueueNames.OWNER,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GrpcPackageNames.OWNER,
      protoPath: join(process.cwd(), 'protos/owner.proto'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
