import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { Categories } from './features/categories/categories';
import { Transactions } from './features/transactions/transactions';
import { Reports } from './features/reports/reports';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    component: Categories,
    canActivate: [authGuard]
  },
  {
    path: 'transactions',
    component: Transactions,
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    component: Reports,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
