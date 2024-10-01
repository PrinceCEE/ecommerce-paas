import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  toJSON: { virtuals: true },
  timestamps: { createdAt: true, updatedAt: true },
})
export class Owner extends Document {}

export const OwnerSchema = SchemaFactory.createForClass(Owner);
