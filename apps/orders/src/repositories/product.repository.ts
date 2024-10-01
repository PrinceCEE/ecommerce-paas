import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Product } from '../schemas';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productRepository: Model<Product>,
  ) {}

  async create() {}

  async update() {}

  async findOne() {}

  async findAll() {}
}
