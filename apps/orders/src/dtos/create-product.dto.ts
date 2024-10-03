export class CreateProductDto {
  id: string;
  name: string;
  price: string;
  description: string;
  sku: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
