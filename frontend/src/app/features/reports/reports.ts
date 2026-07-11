import { Component, computed, inject, signal } from '@angular/core';
import { API_URL } from '../../core/config/api.config';
import { httpResource } from '@angular/common/http';
import { MonthlySummary } from './models/report.model';
import { FormsModule } from '@angular/forms';
import { ApiEndpoints } from '../../shared/constants/api-endpoints';
import { CurrencyPipe } from '@angular/common';
import { EmptyState, LoadingSpinner, PageCard, PageHeader, SummaryCard } from '../../shared/components';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  ArcElement,
  ChartData,
  ChartOptions,
  DoughnutController,
  Legend,
  Tooltip,
} from 'chart.js';
import { BaseChartDirective, provideCharts } from 'ng2-charts';

@Component({
  selector: 'app-reports',
  imports: [
    FormsModule,

    PageHeader,
    PageCard,
    LoadingSpinner,
    EmptyState,
    SummaryCard,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    BaseChartDirective,
  ],
  providers: [
    provideCharts({
      registerables: [DoughnutController, ArcElement, Legend, Tooltip],
    }),
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {
  private readonly apiUrl = inject(API_URL);

  readonly year = signal(new Date().getFullYear());
  readonly month = signal(new Date().getMonth() + 1);

  readonly monthlySummary = httpResource<MonthlySummary>(
    () =>
      `${this.apiUrl}${ApiEndpoints.reports}/monthly-summary?year=${this.year()}&month=${this.month()}`,
    {
      defaultValue: {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
      },
    }
  );

  readonly hasActivity = computed(() => {
    const summary = this.monthlySummary.value();
    return summary.totalIncome > 0 || summary.totalExpenses > 0;
  });

  readonly comparisonChartData = computed<ChartData<'doughnut'>>(() => {
    const summary = this.monthlySummary.value();

    return {
      labels: ['Income', 'Expenses'],
      datasets: [
        {
          data: [summary.totalIncome, summary.totalExpenses],
          backgroundColor: ['#2e7d32', '#d32f2f'],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    };
  });

  readonly comparisonChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${new Intl.NumberFormat('de-DE', {
              style: 'currency',
              currency: 'EUR',
            }).format(context.parsed)}`,
        },
      },
    },
  };

  reload(): void {
    this.monthlySummary.reload();
  }
}
