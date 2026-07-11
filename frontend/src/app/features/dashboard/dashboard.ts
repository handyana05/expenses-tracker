import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth/auth/auth';
import { API_URL } from '../../core/config/api.config';
import { MonthlySummary } from '../reports/models/report.model';
import { httpResource } from '@angular/common/http';
import { ApiEndpoints } from '../../shared/constants/api-endpoints';
import { AppRoutes } from '../../shared/constants/app-routes';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { EmptyState, LoadingSpinner, PageCard, PageHeader, SummaryCard } from '../../shared/components';
import { MatTableModule } from '@angular/material/table';
import { Transaction } from '../transactions/models/transaction.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    CurrencyPipe,
    MatButtonModule,
    MatTableModule,
    PageHeader,
    PageCard,
    SummaryCard,
    LoadingSpinner,
    EmptyState,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly apiUrl = inject(API_URL);

  private readonly currentDate = new Date();

  readonly monthlySummary = httpResource<MonthlySummary>(
    () =>
      `${this.apiUrl}${ApiEndpoints.reports}/monthly-summary?year=${this.currentDate.getFullYear()}&month=${this.currentDate.getMonth() + 1}`,
    {
      defaultValue: {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
      },
    }
  );

  readonly recentTransactions = httpResource<Transaction[]>(
    () => `${this.apiUrl}/transactions`,
    {
      defaultValue: [],
    }
  );

  readonly recentTransactionColumns = [
    'transactionDate',
    'categoryName',
    'amount',
  ];

  async logout(): Promise<void> {
    this.auth.logout();
    await this.router.navigate([AppRoutes.login]);
  }
}
