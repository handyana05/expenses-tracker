import { TestBed } from '@angular/core/testing';

import { AuthState } from './auth-state';
import { TokenStorage } from '../token-storage/token-storage';

describe('AuthState', () => {
  let service: AuthState;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AuthState, TokenStorage],
    });

    service = TestBed.inject(AuthState);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should not be authenticated initially', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.accessToken()).toBeNull();
  });

  it('should set authenticated state', () => {
    service.setAuthenticated('test-token');

    expect(service.isAuthenticated()).toBe(true);
    expect(service.accessToken()).toBe('test-token');
  });

  it('should clear authenticated state', () => {
    service.setAuthenticated('test-token');

    service.clear();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.accessToken()).toBeNull();
  });
});
