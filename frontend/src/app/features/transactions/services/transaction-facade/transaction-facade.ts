import { inject, Service, signal } from '@angular/core';
import { Transaction } from '../transaction/transaction';
import { CreateTransactionCommand } from '../../models/create-transaction.command';
import { UpdateTransactionCommand } from '../../models/update-transaction.command';
import { finalize, Observable, tap } from 'rxjs';
import { Messages } from '../../../../shared/constants/messages';
import { ImportTransactionsResult } from '../../models/import-transactions-result.model';

@Service()
export class TransactionFacade {
    private readonly transactionService = inject(Transaction);

    readonly creating = signal(false);
    readonly updating = signal(false);
    readonly deleting = signal(false);
    readonly importing = signal(false);
    readonly error = signal<string | null>(null);

    create(command: CreateTransactionCommand): Observable<Transaction> {
        this.creating.set(true);
        this.error.set(null);

        return this.transactionService.create(command).pipe(
            tap({
               error: () => this.error.set(Messages.transactionCreated) 
            }),
            finalize(() => this.creating.set(false))
        );
    }

    update(command: UpdateTransactionCommand): Observable<Transaction> {
        this.updating.set(true);
        this.error.set(null);

        return this.transactionService.update(command).pipe(
            tap({
                error: () => this.error.set(Messages.transactionUpdated)
            }),
            finalize(() => this.updating.set(false))
        );
    }

    delete(id: string): Observable<Object> {
        this.deleting.set(true);
        this.error.set(null);

        return this.transactionService.delete(id).pipe(
            tap({
                error: () => this.error.set(Messages.transactionDeleted)
            }),
            finalize(() => this.deleting.set(false))
        );
    }

    import(commands: readonly CreateTransactionCommand[]): Observable<ImportTransactionsResult> {
        this.importing.set(true);
        this.error.set(null);

        return this.transactionService.import(commands).pipe(
            tap({
                error: () => this.error.set('Could not import transactions.')
            }),
            finalize(() => this.importing.set(false))
        );
    }
}
