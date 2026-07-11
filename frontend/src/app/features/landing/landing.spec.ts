import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Landing } from './landing';
import { AuthState } from '../../core/auth/auth-state/auth-state';

describe('Landing', () => {
  let fixture: ComponentFixture<Landing>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Landing],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should provide sign-in and registration actions', () => {
    const links = Array.from(
      fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>
    );

    expect(links.some((link) => link.getAttribute('href') === '/login')).toBe(true);
    expect(links.some((link) => link.getAttribute('href') === '/register')).toBe(true);
  });

  it('should replace guest actions with a dashboard action when authenticated', () => {
    TestBed.inject(AuthState).setAuthenticated('test-token');
    fixture.detectChanges();

    const links = Array.from(
      fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>
    );

    expect(links.some((link) => link.getAttribute('href') === '/dashboard')).toBe(true);
    expect(links.some((link) => link.getAttribute('href') === '/login')).toBe(false);
    expect(links.some((link) => link.getAttribute('href') === '/register')).toBe(false);
  });
});
