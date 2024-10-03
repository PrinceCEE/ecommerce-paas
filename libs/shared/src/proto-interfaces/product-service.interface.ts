import { Observable } from 'rxjs';

export interface GetProductsRequest {
  ids: string[];
}

export interface GetProductsResponse {
  products: Product[];
}

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  sku: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductService {
  GetProducts(data: GetProductsRequest): Observable<GetProductsResponse>;
}
