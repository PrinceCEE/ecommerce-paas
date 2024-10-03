export type ProductResponse = {
  id: string;
  name: string;
  price: string;
  description: string;
  sku: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItemResponse = {
  id: string;
  orderId: string;
  product: ProductResponse;
  unitPrice: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
};

export type ApiResponse<T = null> = {
  success?: boolean;
  message: string;
  data?: T;
};
