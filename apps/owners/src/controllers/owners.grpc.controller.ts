import { Controller } from '@nestjs/common';
import { OwnersService } from '../services/owners.service';

@Controller()
export class OwnersGrpcController {
  constructor(private readonly ownersService: OwnersService) {}

  async findOne() {}

  async findAll() {}
}
