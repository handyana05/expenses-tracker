import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { 
  HttpClient, 
  provideHttpClient, 
  withInterceptors 
} from '@angular/common/http';

import { authInterceptor } from './auth-interceptor';
import { AuthState } from '../auth/auth-state/auth-state';
import { TokenStorage } from '../auth/token-storage/token-storage';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authState: AuthState;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthState,
        TokenStorage,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authState = TestBed.inject(AuthState);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should not add authorization header when token does not exist', () => {
    http.get('/api/categories').subscribe();

    const request = httpMock.expectOne('/api/categories');

    expect(request.request.headers.has('Authorization')).toBe(false);

    request.flush([]);
  });

  it('should add authorization header when token exists', () => {
    authState.setAuthenticated('test-token');

    http.get('/api/categories').subscribe();

    const request = httpMock.expectOne('/api/categories');

    expect(request.request.headers.get('Authorization')).toBe(
      'Bearer test-token'
    );

    request.flush([]);
  });
});
