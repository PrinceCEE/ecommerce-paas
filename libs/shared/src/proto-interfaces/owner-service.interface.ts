import { Observable } from 'rxjs';

export interface FindOwnerById {
  ownerId: string;
}

export interface OwnerService {
  findById(data: FindOwnerById): Observable<any>;
}
