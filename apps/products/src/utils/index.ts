import { Owner, Product } from '../schemas';
import { OwnerResponse, ProductResponse } from '../types';

export const mapToOwnerResponse = (owner: Owner): OwnerResponse => {
  return {
    id: owner.id,
    firstName: owner.firstName,
    lastName: owner.lastName,
    email: owner.email,
    address: owner.address,
  };
};

export const mapToProductResponse = (product: Product): ProductResponse => {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    description: product.description,
    price: product.price,
    owner: mapToOwnerResponse(product.owner as Owner),
  };
};
