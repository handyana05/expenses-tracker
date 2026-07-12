import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Localization } from '../../../core/localization/localization';

export type SummaryCardTone =
  | 'default'
  | 'income'
  | 'expense'
  | 'balance';

@Component({
  selector: 'app-summary-card',
  imports: [
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.scss',
})
export class SummaryCard {
  readonly localization = inject(Localization);
  readonly title = input.required<string>();
  readonly value = input.required<number>();
  readonly icon = input.required<string>();
  readonly tone = input<SummaryCardTone>('default');
}
