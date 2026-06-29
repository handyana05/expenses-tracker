import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../core/auth/auth/auth';
import { LoginFormFactory } from './login.form-factory';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly form = LoginFormFactory.create();

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.auth.login(this.form.getRawValue())
      .subscribe({
        next: async () => {
          await this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage.set('Invalid email or password.');
          this.isSubmitting.set(false);
        },
        complete: () => {
          this.isSubmitting.set(false);
        }
      })
  }
}
