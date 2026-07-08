import { Component, inject } from '@angular/core';
import { API_URL } from '../../core/config/api.config';
import { httpResource } from '@angular/common/http';
import { Category } from './models/category.model';
import { ApiRoutes } from '../../core/api/api-routes';
import { CategoryFacade } from './services/category-facade/category-facade';
import { CategoryFormFactory } from './category-form.factory';
import { CreateCategoryCommand } from './models/create-category.command';
import { CategoryType as SharedCategoryType } from '../../shared/models/category-type.model';
import { ReactiveFormsModule } from '@angular/forms';
import { PageHeader, EmptyState, LoadingSpinner } from '../../shared/components';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialog, Snackbar } from '../../shared/services';

@Component({
  selector: 'app-categories',
  imports: [ 
    ReactiveFormsModule,
    PageHeader, 
    EmptyState,
    LoadingSpinner,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  private readonly apiUrl = inject(API_URL);
  private editingCategoryId: string | null = null;

  readonly confirmDialog = inject(ConfirmDialog);
  readonly snackbar = inject(Snackbar);
  
  readonly facade = inject(CategoryFacade);
  readonly form = CategoryFormFactory.create();

  readonly CategoryType = SharedCategoryType;
  readonly categories = httpResource<Category[]>(
    () => `${this.apiUrl}${ApiRoutes.categories.list}`,
    {
      defaultValue: [],
    }
  );

  readonly displayedColumns = [
    'name',
    'type',
    'actions',
  ];

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

      this.facade.update({ ...command, id: this.editingCategoryId }).subscribe({
        next: () => {
          this.snackbar.success(
              'Category updated.'
          );
          this.resetForm();
          this.categories.reload();
        },
        error: () => this.snackbar.error(
          this.facade.error() || 'Unexpected error.'
        )
      });
      return;
    }
    
    if (this.facade.creating()) {
      return;
    }

    this.facade.create(command).subscribe({
      next: () => {
         this.snackbar.success(
            'Category created.'
        );
        this.resetForm();
        this.categories.reload();
      },
      error: () => this.snackbar.error(
        this.facade.error() || 'Unexpected error.'
      )
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
    this.confirmDialog
      .confirm({
          title: 'Delete category',
          message: 'Are you sure you want to delete this category?',
      })
      .subscribe({
        next: (confirmed) => {
          if (!confirmed || this.facade.deleting()) {
            return;
          }

          this.facade.delete(id).subscribe({
            next: () => {
              this.snackbar.success(
                  'Category deleted.'
              );
              this.categories.reload();
            }
          });
        },
        error: () => this.snackbar.error(
          this.facade.error() || 'Unexpected error.'
        )
      });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      type: SharedCategoryType.Expense,
    });
    this.editingCategoryId = null;
  }
}
