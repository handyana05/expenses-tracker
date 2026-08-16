import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { fakeAsync, tick } from '@angular/core/testing';

import { Shell } from './shell';
import { API_URL } from '../../core/config/api.config';
import { provideRouter } from '@angular/router';
import { AuthState } from '../../core/auth/auth-state/auth-state';
import { By } from '@angular/platform-browser';
import { MatSidenavContainer } from '@angular/material/sidenav';

describe('Shell', () => {
  let component: Shell;
  let fixture: ComponentFixture<Shell>;
  let breakpointObserver: BreakpointObserver;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideRouter([]),
        {
          provide: API_URL,
          useValue: 'https://localhost:7115/api',
        },
      ],
    }).compileComponents();

    breakpointObserver = TestBed.inject(BreakpointObserver);

    TestBed.inject(AuthState).setAuthenticated('test-token', {
      email: 'jane@example.com',
      displayName: 'Jane Doe',
    });

    fixture = TestBed.createComponent(Shell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show only the authenticated user initials in the toolbar', () => {
    expect(fixture.nativeElement.querySelector('.shell__avatar').textContent.trim()).toBe('JD');
    expect(fixture.nativeElement.querySelector('.shell__user-button').title).toBe('Jane Doe');
    expect(fixture.nativeElement.querySelector('.shell__user-label')).toBeNull();
  });

  it('should toggle the collapsed sidenav state', () => {
    expect(component.isCollapsed()).toBe(false);

    component.toggleSidenav();

    expect(component.isCollapsed()).toBe(true);
  });

  it('should keep the sidenav in overlay mode on handset layouts', () => {
    component.isMobile.set(true);
    fixture.detectChanges();

    expect(component.isMobile()).toBe(true);
  });

  it('should autosize the sidenav container when its width changes', () => {
    const container = fixture.debugElement.query(By.directive(MatSidenavContainer))
      .componentInstance as MatSidenavContainer;

    expect(container.autosize).toBe(true);
  });

  it('should expose theme and language preferences through the user menu', () => {
    component.theme.set('light');
    component.theme.toggle();
    component.localization.setLocale('de');

    expect(component.theme.current()).toBe('dark');
    expect(component.localization.locale()).toBe('de');
  });
});