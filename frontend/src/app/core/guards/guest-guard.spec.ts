import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { guestGuard } from './guest-guard';
import { AuthState } from '../auth/auth-state/auth-state';
import { AppRoutes } from '../../shared/constants/app-routes';

describe('guestGuard', () => {
  const authStateMock = { isAuthenticated: vi.fn() };
  const routerMock = { createUrlTree: vi.fn() };

  beforeEach(() => {
    authStateMock.isAuthenticated.mockReset();
    routerMock.createUrlTree.mockReset();

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthState, useValue: authStateMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should allow unauthenticated users', () => {
    authStateMock.isAuthenticated.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as never, {} as never)
    );

    expect(result).toBe(true);
  });

  it('should redirect authenticated users to the dashboard', () => {
    const urlTree = {} as never;
    authStateMock.isAuthenticated.mockReturnValue(true);
    routerMock.createUrlTree.mockReturnValue(urlTree);

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as never, {} as never)
    );

    expect(routerMock.createUrlTree).toHaveBeenCalledWith([AppRoutes.dashboard]);
    expect(result).toBe(urlTree);
  });
});
