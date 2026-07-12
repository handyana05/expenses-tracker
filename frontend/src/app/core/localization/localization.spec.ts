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
    expect(service.translate('account.logout')).toBe('Abmelden');
  });
});
