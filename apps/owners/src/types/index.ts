import { Owner } from '../schemas';

export type OwnerResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ApiResponse<T = null> = {
  success?: boolean;
  message: string;
  data?: T;
};
