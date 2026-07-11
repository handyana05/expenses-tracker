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
import { Router } from '@angular/router';
import { AppRoutes } from '../../shared/constants/app-routes';
import { UserStorage } from '../auth/user-storage/user-storage';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authState: AuthState;
  const routerMock = {
    navigateByUrl: vi.fn(),
  };

  beforeEach(() => {
    localStorage.clear();
    routerMock.navigateByUrl.mockReset();
    routerMock.navigateByUrl.mockResolvedValue(true);

    TestBed.configureTestingModule({
      providers: [
        AuthState,
        TokenStorage,
        UserStorage,
        { provide: Router, useValue: routerMock },
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

  it('should clear authentication and redirect to login on unauthorized response', () => {
    authState.setAuthenticated('expired-token');

    http.get('/api/categories').subscribe({ error: () => undefined });

    const request = httpMock.expectOne('/api/categories');
    request.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(authState.isAuthenticated()).toBe(false);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(AppRoutes.login);
  });

  it('should redirect only once when concurrent requests return unauthorized', () => {
    authState.setAuthenticated('expired-token');

    http.get('/api/categories').subscribe({ error: () => undefined });
    http.get('/api/transactions').subscribe({ error: () => undefined });

    httpMock
      .expectOne('/api/categories')
      .flush(null, { status: 401, statusText: 'Unauthorized' });
    httpMock
      .expectOne('/api/transactions')
      .flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(routerMock.navigateByUrl).toHaveBeenCalledTimes(1);
  });
});
