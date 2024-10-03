import { Owner } from '../schemas';

export type OwnerResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type ApiResponse<T = null> = {
  success?: boolean;
  message: string;
  data?: T;
};
