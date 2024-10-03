import { Controller } from '@nestjs/common';
import { OwnersService } from '../services/owners.service';
import { GrpcMethod } from '@nestjs/microservices';
import { GetOwnerRequest } from '@libs/shared';

@Controller()
export class OwnersGrpcController {
  constructor(private readonly ownersService: OwnersService) {}

  @GrpcMethod('OwnerService', 'GetOwner')
  async getOwner(data: GetOwnerRequest) {
    const response = await this.ownersService.findOneOwner(data.ownerId);
    return { owner: response.data.owner };
  }
}
