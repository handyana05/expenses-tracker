import { TestBed } from '@angular/core/testing';
import { Localization } from './localization';

describe('Localization', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('changes the document language and persists the locale', () => {
    const service = TestBed.inject(Localization);
    service.setLocale('de');
    expect(service.locale()).toBe('de');
    expect(document.documentElement.lang).toBe('de');
    expect(localStorage.getItem('expense-tracker-locale')).toBe('de');
  });

  it('returns the translation for the active locale', () => {
    const service = TestBed.inject(Localization);
    service.setLocale('de');
    expect(service.translate('Logout')).toBe('Abmelden');
  });

  it('formats values and pluralized feedback for the active locale', () => {
    const service = TestBed.inject(Localization);
    service.setLocale('de');

    expect(service.formatCurrency(1234.5)).toContain('1.234,50');
    expect(service.importedTransactions(2)).toBe('2 Transaktionen importiert.');
  });
});
