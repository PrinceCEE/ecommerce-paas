import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Owner } from '../schemas';
import { CreateOwnerDto, UpdateOwnerDto } from '../dtos';

@Injectable()
export class OwnerRepository {
  constructor(
    @InjectModel(Owner.name) private readonly ownerModel: Model<Owner>,
  ) {}

  async create(createOwnerDto: CreateOwnerDto) {
    const { id, ...dtos } = createOwnerDto;
    return this.ownerModel.create({ _id: id, ...dtos });
  }

  async update(ownerId: string, updateOwnerDto: UpdateOwnerDto) {
    return this.ownerModel.findOneAndUpdate({ _id: ownerId }, updateOwnerDto, {
      new: true,
    });
  }

  async findById(ownerId: string) {
    return this.ownerModel.findOne({ _id: ownerId });
  }

  async findByEmail(email: string) {
    return this.ownerModel.findOne({ email });
  }
}
