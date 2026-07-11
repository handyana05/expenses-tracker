import { TestBed } from '@angular/core/testing';

import { AuthState } from './auth-state';
import { TokenStorage } from '../token-storage/token-storage';
import { UserStorage } from '../user-storage/user-storage';

describe('AuthState', () => {
  let service: AuthState;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AuthState, TokenStorage, UserStorage],
    });

    service = TestBed.inject(AuthState);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should not be authenticated initially', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.accessToken()).toBeNull();
    expect(service.user()).toBeNull();
  });

  it('should set authenticated state', () => {
    service.setAuthenticated('test-token', {
      email: 'jane@example.com',
      displayName: 'Jane Doe',
    });

    expect(service.isAuthenticated()).toBe(true);
    expect(service.accessToken()).toBe('test-token');
    expect(service.userLabel()).toBe('Jane Doe');
    expect(service.userInitials()).toBe('JD');
  });

  it('should clear authenticated state', () => {
    service.setAuthenticated('test-token');

    service.clear();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.accessToken()).toBeNull();
    expect(service.user()).toBeNull();
  });

  it('should use the email when the display name is unavailable', () => {
    service.setAuthenticated('test-token', {
      email: 'jane.doe@example.com',
      displayName: null,
    });

    expect(service.userLabel()).toBe('jane.doe@example.com');
    expect(service.userInitials()).toBe('JD');
  });
});
