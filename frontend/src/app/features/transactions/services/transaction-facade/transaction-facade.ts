import { inject, Service, signal } from '@angular/core';
import { Transaction } from '../transaction/transaction';
import { CreateTransactionCommand } from '../../models/create-transaction.command';
import { UpdateTransactionCommand } from '../../models/update-transaction.command';

@Service()
export class TransactionFacade {
    private readonly transactionService = inject(Transaction);

    readonly creating = signal(false);
    readonly updating = signal(false);
    readonly deleting = signal(false);
    readonly error = signal<string | null>(null);

    create(command: CreateTransactionCommand, onSuccess?: () => void): void {
        this.creating.set(true);
        this.error.set(null);

        this.transactionService.create(command).subscribe({
        next: () => onSuccess?.(),
        error: () => {
            this.error.set('Could not create transaction.');
            this.creating.set(false);
        },
        complete: () => this.creating.set(false),
        });
    }

    update(command: UpdateTransactionCommand, onSuccess?: () => void): void {
        this.updating.set(true);
        this.error.set(null);

        this.transactionService.update(command).subscribe({
        next: () => onSuccess?.(),
        error: () => {
            this.error.set('Could not update transaction.');
            this.updating.set(false);
        },
        complete: () => this.updating.set(false),
        });
    }

    delete(id: string, onSuccess?: () => void): void {
        this.deleting.set(true);
        this.error.set(null);

        this.transactionService.delete(id).subscribe({
        next: () => onSuccess?.(),
        error: () => {
            this.error.set('Could not delete transaction.');
            this.deleting.set(false);
        },
        complete: () => this.deleting.set(false),
        });
    }
}
