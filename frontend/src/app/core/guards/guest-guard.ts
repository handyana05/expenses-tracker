import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '../auth/auth-state/auth-state';
import { AppRoutes } from '../../shared/constants/app-routes';

export const guestGuard: CanActivateFn = () => {
  const authState = inject(AuthState);
  const router = inject(Router);

  if (!authState.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([AppRoutes.dashboard]);
};
