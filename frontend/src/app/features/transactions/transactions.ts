import { Component, inject } from '@angular/core';
import { API_URL } from '../../core/config/api.config';
import { TransactionFacade } from './services/transaction-facade/transaction-facade';
import { TransactionFormFactory } from './transaction-form.factory';
import { httpResource } from '@angular/common/http';
import { Category } from '../categories/models/category.model';
import { Transaction } from './models/transaction.model';
import { CreateTransactionCommand } from './models/create-transaction.command';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ConfirmDialog, Snackbar } from '../../shared/services';
import { ApiEndpoints } from '../../shared/constants/api-endpoints';
import { MatTableModule } from '@angular/material/table';
import { EmptyState, LoadingSpinner, PageCard, PageHeader } from '../../shared/components';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-transactions',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    CurrencyPipe,

    PageHeader,
    PageCard,
    EmptyState,
    LoadingSpinner,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
  ],
  providers: [TransactionFacade],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class Transactions {
    private readonly apiUrl = inject(API_URL);

    readonly confirmDialog = inject(ConfirmDialog);
    readonly snackbar = inject(Snackbar);

    readonly facade = inject(TransactionFacade);
    readonly form = TransactionFormFactory.create();

    private editingTransactionId: string | null = null;

    readonly categories = httpResource<Category[]>(
      () => `${this.apiUrl}${ApiEndpoints.categories}`,
      { defaultValue: [] }
    );

    readonly transactions = httpResource<Transaction[]>(
      () => `${this.apiUrl}${ApiEndpoints.transactions}`,
      { defaultValue: [] }
    );

    readonly displayedColumns = [
      'transactionDate',
      'categoryName',
      'amount',
      'description',
      'actions',
    ];

    get isEditing(): boolean {
      return this.editingTransactionId !== null;
    }

    get submitButtonText(): string {
      if (this.facade.creating()) return 'Creating...';
      if (this.facade.updating()) return 'Updating...';
      return this.isEditing ? 'Update' : 'Create';
    }

    saveTransaction(): void {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      const value = this.form.getRawValue();

      const command: CreateTransactionCommand = {
        categoryId: value.categoryId,
        amount: value.amount,
        transactionDate: new Date(value.transactionDate).toISOString(),
        description: value.description || null,
      };

      if (this.editingTransactionId) {
        if (this.facade.updating()) return;

        this.facade.update(
          {
            ...command,
            id: this.editingTransactionId,
          }).subscribe({
            next: () => {
              this.resetForm();
              this.transactions.reload();
            }
          });

        return;
      }

      if (this.facade.creating()) return;

      this.facade.create(command).subscribe({
        next: () => {
          this.resetForm();
          this.transactions.reload();
        }
      });
    }

    editTransaction(transaction: Transaction): void {
      this.editingTransactionId = transaction.id;

      this.form.setValue({
        categoryId: transaction.categoryId,
        amount: transaction.amount,
        transactionDate: transaction.transactionDate.slice(0, 10),
        description: transaction.description ?? '',
      });
    }

    deleteTransaction(id: string): void {
      this.confirmDialog
        .confirm({
            title: 'Delete transaction',
            message: 'Are you sure you want to delete this transaction?',
        })
        .subscribe({
          next: (confirmed) => {
            if (!confirmed || this.facade.deleting()) return;

            this.facade.delete(id).subscribe({
              next: () => {
                this.transactions.reload();
              }
            });
          }
        });
    }

    cancelEdit(): void {
      this.resetForm();
    }

    private resetForm(): void {
      this.form.reset({
        categoryId: '',
        amount: 0,
        transactionDate: new Date().toISOString().slice(0, 10),
        description: '',
      });

      this.editingTransactionId = null;
    }
}
