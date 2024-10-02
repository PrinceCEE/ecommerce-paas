export type ProductResponse = {
  id: string;
  name: string;
  price: string;
  description: string;
  sku: string;
  ownerId: string;
};

export type OrderItemResponse = {
  id: string;
  orderId: string;
  product: ProductResponse;
  unitPrice: string;
  quantity: number;
};

export type OrderResponse = {
  id: string;
  orderItems: OrderItemResponse[];
  totalAmount: string;
  instructions: string;
  buyerInfo: {
    name: string;
    email: string;
    address: string;
  };
};

export type ApiResponse<T = null> = {
  success?: boolean;
  message: string;
  data?: T;
};
