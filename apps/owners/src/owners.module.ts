import { Module } from '@nestjs/common';
import { OwnersGrpcController, OwnersHttpController } from './controllers';
import { OwnersService } from './services';
import { OwnerRepository } from './repositories';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Owner, OwnerSchema } from './schemas';
import { AuthGuard } from './owner.guard';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueNames, RabbitMQNames } from '@libs/shared';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      {
        name: Owner.name,
        schema: OwnerSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: RabbitMQNames.OWNER,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: QueueNames.OWNER,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [OwnersGrpcController, OwnersHttpController],
  providers: [
    OwnersService,
    OwnerRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class OwnersModule {}
