export type OwnerResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
};

export type ProductResponse = {
  id: string;
  name: string;
  price: string;
  description: string;
  sku: string;
  owner: OwnerResponse;
};

export type ApiResponse<T = null> = {
  success?: boolean;
  message: string;
  data?: T;
};
