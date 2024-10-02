import { IsMongoId, IsNumberString, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumberString()
  price: string;

  @IsString()
  description: string;

  @IsString()
  sku: string;

  @IsMongoId()
  ownerId: string;
}
