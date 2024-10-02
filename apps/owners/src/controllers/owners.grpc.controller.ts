import { Controller } from '@nestjs/common';
import { OwnersService } from '../services/owners.service';
import { GrpcMethod } from '@nestjs/microservices';
import { FindOwnerById } from '@libs/shared';

@Controller()
export class OwnersGrpcController {
  constructor(private readonly ownersService: OwnersService) {}

  @GrpcMethod('OwnerService', 'FindById')
  async findById(data: FindOwnerById) {
    return this.ownersService.findOneOwner(data.ownerId);
  }
}
