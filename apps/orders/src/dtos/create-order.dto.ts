import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  quantity: number;

  unitPrice?: string;
}

class BuyerInfoDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  deliveryAddress: string;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => BuyerInfoDto)
  buyerInfo: BuyerInfoDto;

  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  @IsOptional()
  instructions: string;

  totalAmount?: string;
}
