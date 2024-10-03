import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';
import { Order } from './order.schema';
import { Product } from './product.schema';

@Schema({
  toJSON: { virtuals: true },
  timestamps: { createdAt: true, updatedAt: true },
})
export class OrderItem extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Order.name,
    required: true,
  })
  order: Order | MongooseSchema.Types.ObjectId | string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product: Product | MongooseSchema.Types.ObjectId | string;

  @Prop({ required: true })
  unitPrice: string;

  @Prop({ required: true })
  quantity: number;

  createdAt: Date;
  updatedAt: Date;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
