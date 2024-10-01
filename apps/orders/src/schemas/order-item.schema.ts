import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  toJSON: { virtuals: true },
  timestamps: { createdAt: true, updatedAt: true },
})
export class OrderItem extends Document {}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
