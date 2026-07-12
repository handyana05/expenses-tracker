import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { RegisterFacade } from './services/register-facade/register-facade';
import { RegisterFormFactory } from './register.form-factory';
import { RegisterCommand } from './models/register.model';
import { TranslatePipe } from '../../../core/localization/translate.pipe';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  readonly facade = inject(RegisterFacade);
  readonly form = RegisterFormFactory.create();

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.facade.loading()) {
      return;
    }

    const command: RegisterCommand = this.form.getRawValue();

    this.facade.register(command).subscribe({
      error: () => {
        // Error state is handled by the facade.
      },
    });
  }
}
