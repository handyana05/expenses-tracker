import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export type SummaryCardTone =
  | 'default'
  | 'income'
  | 'expense'
  | 'balance';

@Component({
  selector: 'app-summary-card',
  imports: [
    CurrencyPipe,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.scss',
})
export class SummaryCard {
  readonly title = input.required<string>();
  readonly value = input.required<number>();
  readonly icon = input.required<string>();
  readonly tone = input<SummaryCardTone>('default');
}
