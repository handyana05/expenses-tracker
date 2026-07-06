import { Component, inject, signal } from '@angular/core';
import { API_URL } from '../../core/config/api.config';
import { httpResource } from '@angular/common/http';
import { MonthlySummary } from './models/report.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  imports: [FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {
  private readonly apiUrl = inject(API_URL);

  readonly year = signal(new Date().getFullYear());
  readonly month = signal(new Date().getMonth() + 1);

  readonly monthlySummary = httpResource<MonthlySummary>(
    () =>
      `${this.apiUrl}/reports/monthly-summary?year=${this.year()}&month=${this.month()}`,
    {
      defaultValue: {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
      },
    }
  );

  reload(): void {
    this.monthlySummary.reload();
  }
}
