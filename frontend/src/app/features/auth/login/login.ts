import { Component, inject, signal } from '@angular/core';
import { LoginFormFactory } from './login.form-factory';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFacade } from './login-facade/login-facade';
import { LoginCommand } from './login.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
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
