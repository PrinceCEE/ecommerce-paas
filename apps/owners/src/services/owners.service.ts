import { Injectable } from '@nestjs/common';
import { OwnerRepository } from '../repositories';

@Injectable()
export class OwnersService {
  constructor(private readonly ownerRepository: OwnerRepository) {}
}
