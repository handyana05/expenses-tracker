import { TestBed } from '@angular/core/testing';

import { Auth } from './auth';
import { RegisterRequest } from '../../models/register-request.model';
import { AuthResult } from '../../models/auth-result.model';
import { LoginRequest } from '../../models/login-request.model';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthState } from '../auth-state/auth-state';
import { TokenStorage } from '../token-storage/token-storage';
import { provideHttpClient } from '@angular/common/http';
import { API_URL } from '../../config/api.config';

describe('Auth', () => {
  let auth: Auth;
  let httpMock: HttpTestingController;
  let authState: AuthState;

  const apiUrl = 'https://localhost:7115/api';

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        Auth,
        AuthState,
        TokenStorage,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: API_URL,
          useValue: apiUrl,
        },
      ],
    });

    auth = TestBed.inject(Auth);
    httpMock = TestBed.inject(HttpTestingController);
    authState = TestBed.inject(AuthState);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should login and set authenticated state', () => {
    const request: LoginRequest = {
      email: 'user@example.com',
      password: 'Password123!',
    };

    const response: AuthResult = {
      userId: 'user-id',
      email: request.email,
      displayName: 'Demo User',
      accessToken: 'access-token',
    };

    auth.login(request).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const httpRequest = httpMock.expectOne(`${apiUrl}/auth/login`);

    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);

    httpRequest.flush(response);

    expect(authState.isAuthenticated()).toBe(true);
    expect(authState.accessToken()).toBe(response.accessToken);
  });

  it('should register and set authenticated state', () => {
    const request: RegisterRequest = {
      email: 'new-user@example.com',
      password: 'Password123!',
      displayName: 'New User',
    };

    const response: AuthResult = {
      userId: 'user-id',
      email: request.email,
      displayName: request.displayName,
      accessToken: 'access-token',
    };

    auth.register(request).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const httpRequest = httpMock.expectOne(`${apiUrl}/auth/register`);

    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);

    httpRequest.flush(response);

    expect(authState.isAuthenticated()).toBe(true);
    expect(authState.accessToken()).toBe(response.accessToken);
  });

  it('should logout and clear authenticated state', () => {
    authState.setAuthenticated('access-token');

    auth.logout();

    expect(authState.isAuthenticated()).toBe(false);
    expect(authState.accessToken()).toBeNull();
  });

  it('should return authentication state', () => {
    expect(auth.isAuthenticated()).toBe(false);

    authState.setAuthenticated('access-token');

    expect(auth.isAuthenticated()).toBe(true);
  });
});
