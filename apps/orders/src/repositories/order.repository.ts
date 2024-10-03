import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Order, OrderItem } from '../schemas';
import { CreateOrderDto, UpdateOrderDto } from '../dtos';
import { OrderResponse } from '../types';
import { mapToOrderResponse } from '../utils';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(OrderItem.name)
    private readonly orderItemModel: Model<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponse> {
    const order = await this.orderModel.create({
      instructions: createOrderDto.instructions,
      buyerInfo: createOrderDto.buyerInfo,
      totalAmount: createOrderDto.totalAmount,
    });

    const orderItems = await Promise.all(
      createOrderDto.items.map(async (i) => {
        return this.orderItemModel
          .create({
            order: order.id,
            product: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })
          .then((i) => i.populate('product'));
      }),
    );

    return mapToOrderResponse(order, orderItems);
  }

  async update(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponse> {
    const updateQuery: UpdateQuery<Order> = {};
    if (updateOrderDto.instructions) {
      updateOrderDto.instructions = updateOrderDto.instructions;
    }
    if (updateOrderDto.buyerInfo) {
      updateOrderDto.buyerInfo = updateOrderDto.buyerInfo;
    }
    if (updateOrderDto.totalAmount) {
      updateOrderDto.totalAmount = updateOrderDto.totalAmount;
    }
    const order = await this.orderModel.findOneAndUpdate(
      { _id: orderId },
      updateQuery,
      { new: true },
    );

    let orderItems: OrderItem[];
    if (updateOrderDto.items?.length) {
      await this.orderItemModel.deleteMany({ order: orderId });

      orderItems = await Promise.all(
        updateOrderDto.items.map((i) => {
          return this.orderItemModel
            .create({
              order: order.id,
              product: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            })
            .then((i) => i.populate('product'));
        }),
      );
    }

    if (!orderItems) {
      orderItems = await this.orderItemModel.find({ order: orderId });
    }

    return mapToOrderResponse(order, orderItems);
  }

  async findOne(orderId: string): Promise<OrderResponse> {
    const [order, orderItems] = await Promise.all([
      this.orderModel.findOne({ _id: orderId }),
      this.orderItemModel.find({ order: orderId }).populate('product'),
    ]);

    return mapToOrderResponse(order, orderItems);
  }

  async findAll(): Promise<OrderResponse[]> {
    const orders = await this.orderModel.find();
    return Promise.all(
      orders.map(async (o) => {
        const orderItems = await this.orderItemModel
          .find({ order: o.id })
          .populate('product');
        return mapToOrderResponse(o, orderItems);
      }),
    );
  }
}
