import { NestFactory } from '@nestjs/core';
import { OwnersModule } from './owners.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { GrpcPackageNames } from '@libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(OwnersModule);
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {},
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GrpcPackageNames.OWNER,
      protoPath: join(__dirname, 'owners/owner.proto'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
