import { EventPattern } from '@nestjs/microservices';
import { OwnerRepository } from '../repositories';
import { EventNames } from '@libs/shared';
import { OwnerResponse } from '../types';
import { Controller } from '@nestjs/common';

@Controller()
export class ProductEventsController {
  constructor(private readonly ownerRepository: OwnerRepository) {}

  @EventPattern(EventNames.OWNER_UPDATED)
  async handleOwnerUpdated(data: OwnerResponse) {
    const { id, ..._data } = data;

    const owner = await this.ownerRepository.findById(id);
    if (!owner) {
      this.ownerRepository.create(data);
      return;
    }

    this.ownerRepository.update(id, _data);
  }
}
