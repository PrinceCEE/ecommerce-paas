import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, UpdateQuery } from 'mongoose';
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

    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponse> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const order = await new this.orderModel({
        instructions: createOrderDto.instructions,
        buyerInfo: createOrderDto.buyerInfo,
        totalAmount: createOrderDto.totalAmount,
      }).save({ session });

      const orderItems = await Promise.all(
        createOrderDto.items.map((i) => {
          const item = new this.orderItemModel({
            order: order.id,
            product: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          });

          return item.save({ session });
        }),
      );

      await session.commitTransaction();
      return mapToOrderResponse(order, orderItems);
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async update(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponse> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
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
        { new: true, session },
      );

      let orderItems: OrderItem[];
      if (updateOrderDto.items?.length) {
        await this.orderItemModel.deleteMany({ order: orderId });

        orderItems = await Promise.all(
          updateOrderDto.items.map((i) => {
            const item = new this.orderItemModel({
              order: order.id,
              product: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            });

            return item.save({ session });
          }),
        );
      }

      if (!orderItems) {
        orderItems = await this.orderItemModel.find({ order: orderId });
      }

      await session.commitTransaction();
      return mapToOrderResponse(order, orderItems);
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async findOne(orderId: string): Promise<OrderResponse> {
    const [order, orderItems] = await Promise.all([
      this.orderModel.findOne({ _id: orderId }),
      this.orderItemModel.find({ order: orderId }),
    ]);

    return mapToOrderResponse(order, orderItems);
  }

  async findAll(): Promise<OrderResponse[]> {
    const orders = await this.orderModel.find();
    return Promise.all(
      orders.map(async (o) => {
        const orderItems = await this.orderItemModel.find({ order: o.id });
        return mapToOrderResponse(o, orderItems);
      }),
    );
  }
}
