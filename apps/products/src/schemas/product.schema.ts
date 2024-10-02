import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Owner } from './owner.schema';

@Schema({
  toJSON: { virtuals: true },
  timestamps: { createdAt: true, updatedAt: true },
})
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  sku: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Owner.name,
    required: true,
  })
  owner: Owner | MongooseSchema.Types.ObjectId | string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
