import { TestBed } from '@angular/core/testing';
import { Theme } from './theme';

describe('Theme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
  });

  it('applies and persists the selected theme', () => {
    const service = TestBed.inject(Theme);
    service.set('dark');
    expect(service.current()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem('expense-tracker-theme')).toBe('dark');
  });

  it('toggles between themes', () => {
    const service = TestBed.inject(Theme);
    service.set('light');
    service.toggle();
    expect(service.current()).toBe('dark');
  });
});
