import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

const STORAGE_KEY = 'expense-tracker-theme';

@Injectable({ providedIn: 'root' })
export class Theme {
  private readonly document = inject(DOCUMENT);
  readonly current = signal<AppTheme>(this.initialTheme());

  constructor() {
    this.apply(this.current());
  }

  toggle(): void {
    this.set(this.current() === 'light' ? 'dark' : 'light');
  }

  set(theme: AppTheme): void {
    this.current.set(theme);
    this.apply(theme);
    this.storage?.setItem(STORAGE_KEY, theme);
  }

  private initialTheme(): AppTheme {
    const stored = this.storage?.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private apply(theme: AppTheme): void {
    this.document.documentElement.dataset['theme'] = theme;
    this.document.documentElement.style.colorScheme = theme;
  }

  private get storage(): Storage | undefined {
    return this.document.defaultView?.localStorage;
  }
}
