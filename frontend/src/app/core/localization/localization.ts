import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { AppLocale, translations } from './translations';

const STORAGE_KEY = 'expense-tracker-locale';

@Injectable({ providedIn: 'root' })
export class Localization {
  private readonly document = inject(DOCUMENT);
  readonly locale = signal<AppLocale>(this.initialLocale());

  constructor() { this.apply(this.locale()); }

  setLocale(locale: AppLocale): void {
    this.locale.set(locale);
    this.apply(locale);
    this.document.defaultView?.localStorage.setItem(STORAGE_KEY, locale);
  }

  translate(text: string): string {
    return translations[this.locale()][text] ?? text;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(this.locale() === 'de' ? 'de-DE' : 'en-US', { style: 'currency', currency: 'EUR' }).format(value);
  }

  formatDate(value: string | Date): string {
    return new Intl.DateTimeFormat(this.locale() === 'de' ? 'de-DE' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value));
  }

  importedTransactions(count: number): string {
    if (this.locale() === 'de') return `${count} Transaktion${count === 1 ? '' : 'en'} importiert.`;
    return `${count} transaction${count === 1 ? '' : 's'} imported.`;
  }

  private initialLocale(): AppLocale {
    const stored = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'de') return stored;
    return this.document.defaultView?.navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
  }

  private apply(locale: AppLocale): void { this.document.documentElement.lang = locale; }
}
