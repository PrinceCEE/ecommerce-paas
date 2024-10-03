import { NestFactory } from '@nestjs/core';
import { OwnersModule } from './owners.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { GrpcPackageNames } from '@libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(OwnersModule);
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      transform: true,
      whitelist: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GrpcPackageNames.OWNER,
      protoPath: join(process.cwd(), 'protos/owner.proto'),
      url: process.env.OWNERS_GRPC_URL,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
