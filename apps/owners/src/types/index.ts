import { Owner } from '../schemas';

export type OwnerResponse = Pick<
  Owner,
  'firstName' | 'lastName' | 'email' | 'id' | 'address'
>;

export type ApiResponse<T = null> = {
  success?: boolean;
  message: string;
  data?: T;
};
