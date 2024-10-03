import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  toJSON: { virtuals: true },
  timestamps: { createdAt: true, updatedAt: true },
})
export class Order extends Document {
  @Prop({ required: true })
  totalAmount: string;

  @Prop()
  instructions: string;

  @Prop({
    type: {
      _id: false,
      name: String,
      email: String,
      deliveryAddress: String,
    },
  })
  buyerInfo: {
    name: string;
    email: string;
    address: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
