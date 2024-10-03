import { Module } from '@nestjs/common';
import { OwnersGrpcController, OwnersHttpController } from './controllers';
import { OwnersService } from './services';
import { OwnerRepository } from './repositories';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Owner, OwnerSchema } from './schemas';

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
  ],
  controllers: [OwnersGrpcController, OwnersHttpController],
  providers: [OwnersService, OwnerRepository],
})
export class OwnersModule {}
