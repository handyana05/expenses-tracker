import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth/auth/auth';
import { API_URL } from '../../core/config/api.config';
import { MonthlySummary } from '../reports/models/report.model';
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [ RouterLink ],
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
      `${this.apiUrl}/reports/monthly-summary?year=${this.currentDate.getFullYear()}&month=${this.currentDate.getMonth() + 1}`,
    {
      defaultValue: {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
      },
    }
  );

  async logout(): Promise<void> {
    this.auth.logout();
    await this.router.navigate(['/login']);
  }
}
