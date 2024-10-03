import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Product } from '../schemas';
import { CreateProductDto, UpdateProductDto } from '../dtos';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { id, ...dtos } = createProductDto;
    return this.productModel.create({ _id: id, ...dtos });
  }

  async updateMany(createProductDtos: CreateProductDto[]) {
    await this.productModel.bulkWrite(
      createProductDtos.map((p) => {
        const { id, ...dtos } = p;
        return {
          updateOne: {
            filter: { _id: id },
            update: { $set: dtos },
            upsert: true,
          },
        };
      }),
    );
  }

  async update(productId: string, updateProductDto: UpdateProductDto) {
    return this.productModel.findOneAndUpdate(
      { _id: productId },
      updateProductDto,
      { new: true },
    );
  }

  async findOne(productId: string) {
    return this.productModel.findOne({ _id: productId });
  }

  async findAll(filter?: { owner?: string }) {
    return this.productModel.find(filter);
  }
}
