import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { Categories } from './features/categories/categories';
import { Transactions } from './features/transactions/transactions';
import { Reports } from './features/reports/reports';
import { Shell } from './layout/shell/shell';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
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
        component: Reports
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
