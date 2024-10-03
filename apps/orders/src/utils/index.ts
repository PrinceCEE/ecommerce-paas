import { Order, OrderItem, Product } from '../schemas';
import { OrderItemResponse, OrderResponse, ProductResponse } from '../types';

export const mapToOrderItemsResponse = (
  orderItem: OrderItem,
): OrderItemResponse => {
  return {
    id: orderItem.id,
    orderId: orderItem.order as string,
    product: mapToProductResponse(orderItem.product as Product),
    unitPrice: orderItem.unitPrice,
    quantity: orderItem.quantity,
    createdAt: orderItem.createdAt,
    updatedAt: orderItem.updatedAt,
  };
};

export const mapToProductResponse = (product: Product): ProductResponse => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    sku: product.sku,
    ownerId: product.ownerId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

export const mapToOrderResponse = (
  order: Order,
  orderItems: OrderItem[],
): OrderResponse => {
  return {
    id: order.id,
    orderItems: orderItems.map((o) => mapToOrderItemsResponse(o)),
    totalAmount: order.totalAmount,
    instructions: order.instructions,
    buyerInfo: order.buyerInfo,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

export const getTotalAmount = (productsResponse: ProductResponse[]) => {
  return productsResponse
    .reduce((prev, curr) => Number(prev) + Number(curr.price), 0)
    .toString();
};
