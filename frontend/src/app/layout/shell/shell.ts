import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Auth } from '../../core/auth/auth/auth';
import { AppRoutes } from '../../shared/constants/app-routes';
import { AuthState } from '../../core/auth/auth-state/auth-state';
import { Theme } from '../../core/preferences/theme';
import { Localization } from '../../core/localization/localization';
import { TranslatePipe } from '../../core/localization/translate.pipe';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly auth = inject(Auth);
  readonly authState = inject(AuthState);
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly theme = inject(Theme);
  readonly localization = inject(Localization);

  readonly isMobile = signal(false);
  readonly isCollapsed = signal(false);

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });
  }

  toggleSidenav(): void {
    this.isCollapsed.update((collapsed) => !collapsed);
  }

  async logout(): Promise<void> {
    this.auth.logout();
    await this.router.navigate([AppRoutes.landing]);
  }
}
