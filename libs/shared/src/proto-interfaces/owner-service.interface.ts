import { Observable } from 'rxjs';

export interface GetOwnerRequest {
  ownerId: string;
}

interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetOwnerResponse {
  owner: Owner;
}

export interface OwnerService {
  getOwner(data: GetOwnerRequest): Observable<GetOwnerResponse>;
}
