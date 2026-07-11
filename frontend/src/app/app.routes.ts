import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { Categories } from './features/categories/categories';
import { Transactions } from './features/transactions/transactions';
import { Shell } from './layout/shell/shell';
import { Landing } from './features/landing/landing';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'categories',
        component: Categories
      },
      {
        path: 'transactions',
        component: Transactions
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports').then(({ Reports }) => Reports)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
