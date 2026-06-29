import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthState } from '../auth/auth-state/auth-state';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthState);
  const token = authState.accessToken();

  if (!token) {
    return next(req);
  }

  const authenticatedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authenticatedRequest);
};
