import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Owner } from '../schemas';

@Injectable()
export class OwnerRepository {
  constructor(
    @InjectModel(Owner.name) private readonly ownerModel: Model<Owner>,
  ) {}

  async create() {}

  async update() {}

  async findOne() {}

  async findAll() {}
}
