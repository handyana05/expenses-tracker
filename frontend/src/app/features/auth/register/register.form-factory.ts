import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

export type RegisterForm = FormGroup<{
  displayName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}>;

export class RegisterFormFactory {
  static create(): RegisterForm {
    return new FormGroup({
      displayName: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(100),
        ],
      }),

      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email,
        ],
      }),

      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
        ],
      }),
    });
  }
}