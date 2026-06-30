import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard } from './auth-guard';
import { AuthState } from '../auth/auth-state/auth-state';

describe('authGuard', () => {
  const authStateMock = {
    isAuthenticated: vi.fn(),
  };

  const routerMock = {
    createUrlTree: vi.fn(),
  };

  beforeEach(() => {
    authStateMock.isAuthenticated.mockReset();
    routerMock.createUrlTree.mockReset();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthState,
          useValue: authStateMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    });
  });

  it('should allow access when user is authenticated', () => {
    authStateMock.isAuthenticated.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(result).toBe(true);
  });

  it('should redirect to login when user is not authenticated', () => {
    const urlTree = {} as any;

    authStateMock.isAuthenticated.mockReturnValue(false);
    routerMock.createUrlTree.mockReturnValue(urlTree);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(urlTree);
  });
});
