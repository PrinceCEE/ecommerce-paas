import { Module } from '@nestjs/common';
import { OwnersGrpcController, OwnersHttpController } from './controllers';
import { OwnersService } from './services';
import { OwnerRepository } from './repositories';

@Module({
  imports: [],
  controllers: [OwnersGrpcController, OwnersHttpController],
  providers: [OwnersService, OwnerRepository],
})
export class OwnersModule {}
