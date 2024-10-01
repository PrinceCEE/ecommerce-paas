import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Order, OrderItem } from '../schemas';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private readonly orderRepository: Model<Order>,
    @InjectModel(OrderItem.name)
    private readonly orderItemRepository: Model<OrderItem>,
  ) {}

  async create() {}

  async update() {}

  async findOne() {}

  async findAll() {}
}
