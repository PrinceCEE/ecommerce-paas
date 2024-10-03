import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Product } from '../schemas';
import { CreateProductDto, UpdateProductDto } from '../dtos';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(createproductDto: CreateProductDto) {
    const { ownerId, ...dtos } = createproductDto;
    return this.productModel
      .create({ owner: ownerId, ...dtos })
      .then((o) => o.populate('owner'));
  }

  async update(productId: string, updateProductDto: UpdateProductDto) {
    return this.productModel
      .findOneAndUpdate({ _id: productId }, updateProductDto, { new: true })
      .populate('owner');
  }

  async findOne(productId: string) {
    return this.productModel.findOne({ _id: productId }).populate('owner');
  }

  async findBySky(sku: string) {
    return this.productModel.findOne({ sku }).populate('owner');
  }

  async findAll(filter?: { owner?: string }) {
    return this.productModel.find(filter).populate('owner');
  }
}
