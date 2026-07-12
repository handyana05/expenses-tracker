import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { API_URL } from '../../core/config/api.config';
import { MonthlySummary } from '../reports/models/report.model';
import { httpResource } from '@angular/common/http';
import { ApiEndpoints } from '../../shared/constants/api-endpoints';
import { MatButtonModule } from '@angular/material/button';
import { EmptyState, LoadingSpinner, PageCard, PageHeader, SummaryCard } from '../../shared/components';
import { Transaction } from '../transactions/models/transaction.model';
import { MatIconModule } from '@angular/material/icon';
import { CategoryType } from '../../shared/models/category-type.model';
import { Localization } from '../../core/localization/localization';
import { TranslatePipe } from '../../core/localization/translate.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    PageHeader,
    PageCard,
    SummaryCard,
    LoadingSpinner,
    EmptyState,
    TranslatePipe,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly apiUrl = inject(API_URL);
  readonly localization = inject(Localization);

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

  readonly CategoryType = CategoryType;
}
