import { TestBed } from '@angular/core/testing';

import { TokenStorage } from './token-storage';

describe('TokenStorage', () => {
  let service: TokenStorage;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [ TokenStorage ]
    });

    service = TestBed.inject(TokenStorage);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should store token', () => {
    service.setToken('test-token');

    expect(service.getToken()).toBe('test-token');
  });

  it('should remove token', () => {
    service.setToken('test-token');

    service.removeToken();

    expect(service.getToken()).toBeNull();
  });
});
