import { FormControl, FormGroup, Validators } from '@angular/forms';

export type TransactionForm = FormGroup<{
  categoryId: FormControl<string>;
  amount: FormControl<number>;
  transactionDate: FormControl<string>;
  description: FormControl<string>;
}>;

export class TransactionFormFactory {
  static create(): TransactionForm {
    return new FormGroup({
      categoryId: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      amount: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0.01)],
      }),
      transactionDate: new FormControl(new Date().toISOString().slice(0, 10), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl('', {
        nonNullable: true,
      }),
    });
  }
}