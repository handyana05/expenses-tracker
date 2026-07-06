import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CategoryType } from './models/category-type.model';

export type CategoryForm = FormGroup<{
  name: FormControl<string>;
  type: FormControl<CategoryType>;
}>;

export class CategoryFormFactory {
  static create(): CategoryForm {
    return new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      type: new FormControl<CategoryType>('Expense', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }
}