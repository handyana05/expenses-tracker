import { Component, inject, signal } from '@angular/core';
import { LoginFormFactory } from './login.form-factory';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFacade } from './services/login-facade/login-facade';
import { LoginCommand } from './models/login.model';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '../../../core/localization/translate.pipe';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe,
  ],
  providers: [LoginFacade],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  readonly facade = inject(LoginFacade);

  readonly form = LoginFormFactory.create();

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.facade.loading()) {
      return;
    }

    const command: LoginCommand = this.form.getRawValue();

    this.facade.login(command);
  }
}
