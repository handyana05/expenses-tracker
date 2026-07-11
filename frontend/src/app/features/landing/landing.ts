import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthState } from '../../core/auth/auth-state/auth-state';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  readonly authState = inject(AuthState);
}
