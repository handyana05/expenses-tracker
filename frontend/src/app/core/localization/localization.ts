import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { AppLocale, TranslationKey, translations } from './translations';

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

  translate(key: TranslationKey): string {
    return translations[this.locale()][key];
  }

  private initialLocale(): AppLocale {
    const stored = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'de') return stored;
    return this.document.defaultView?.navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
  }

  private apply(locale: AppLocale): void { this.document.documentElement.lang = locale; }
}
