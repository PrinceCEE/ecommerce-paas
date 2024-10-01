import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  toJSON: { virtuals: true },
  timestamps: { createdAt: true, updatedAt: true },
})
export class Product extends Document {}

export const ProductSchema = SchemaFactory.createForClass(Product);
