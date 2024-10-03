export type OwnerResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductResponse = {
  id: string;
  name: string;
  price: string;
  description: string;
  sku: string;
  owner: OwnerResponse;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type ApiResponse<T = null> = {
  success?: boolean;
  message: string;
  data?: T;
};
