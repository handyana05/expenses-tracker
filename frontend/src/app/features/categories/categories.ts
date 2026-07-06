import { Component, inject } from '@angular/core';
import { API_URL } from '../../core/config/api.config';
import { httpResource } from '@angular/common/http';
import { Category } from './models/category.model';
import { ApiRoutes } from '../../core/api/api-routes';
import { CategoryFacade } from './services/category-facade/category-facade';
import { CategoryFormFactory } from './category-form.factory';
import { CreateCategoryCommand } from './models/create-category.command';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  imports: [ ReactiveFormsModule ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  private readonly apiUrl = inject(API_URL);
  private editingCategoryId: string | null = null;

  readonly facade = inject(CategoryFacade);
  readonly form = CategoryFormFactory.create();

  readonly categories = httpResource<Category[]>(
    () => `${this.apiUrl}${ApiRoutes.categories.list}`,
    {
      defaultValue: [],
    }
  );

  get isEditing(): boolean {
    return this.editingCategoryId !== null;
  }

  get submitButtonText(): string {
    if (this.facade.creating()) {
      return 'Creating...';
    }
    if (this.facade.updating()) {
      return 'Updating...';
    }
    return this.isEditing ? 'Update' : 'Create';
  }

  createCategory(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const command: CreateCategoryCommand = this.form.getRawValue();

    if (this.editingCategoryId) {
      if (this.facade.updating()) {
        return;
      }

      this.facade.update({ ...command, id: this.editingCategoryId }, () => {
        this.resetForm();
        this.categories.reload();
      });
      return;
    }
    
    if (this.facade.creating()) {
      return;
    }

    this.facade.create(command, () => {
      this.resetForm();
      this.categories.reload();
    });
  }

  editCategory(category: Category): void {
    this.editingCategoryId = category.id;
    this.form.setValue({
      name: category.name,
      type: category.type
    });
  }

  deleteCategory(id: string): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this category?'
    );

    if (!confirmed || this.facade.deleting()) {
      return;
    }

    this.facade.delete(id, () => {
      this.categories.reload();
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      type: 'Expense',
    });
    this.editingCategoryId = null;
  }
}
