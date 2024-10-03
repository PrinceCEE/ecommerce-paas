import { Owner, Product } from '../schemas';
import { OwnerResponse, ProductResponse } from '../types';

export const mapToOwnerResponse = (owner: Owner): OwnerResponse => {
  return {
    id: owner.id,
    firstName: owner.firstName,
    lastName: owner.lastName,
    email: owner.email,
    address: owner.address,
    createdAt: owner.createdAt,
    updatedAt: owner.updatedAt,
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
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
};

export const mapToProductEventResponse = (product: Product) => {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    description: product.description,
    price: product.price,
    ownerId: mapToOwnerResponse(product.owner as Owner).id,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};
