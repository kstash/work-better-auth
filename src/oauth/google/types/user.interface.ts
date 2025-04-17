import { Observable } from 'rxjs';

export interface CheckUserExistsRequest {
  email: string;
}

export interface CheckUserExistsResponse {
  exists: boolean;
}

export interface UserLookupServiceClient {
  checkUserExists(
    request: CheckUserExistsRequest,
  ): Observable<CheckUserExistsResponse>;
}
