import { Component, inject } from '@angular/core';
import { API_URL } from '../../core/config/api.config';
import { httpResource } from '@angular/common/http';
import { Category } from './category.model';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  private readonly apiUrl = inject(API_URL);

  readonly categories = httpResource<Category[]>(
    () => `${this.apiUrl}/categories`,
    {
      defaultValue: [],
    }
  );
}
