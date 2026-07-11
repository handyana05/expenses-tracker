import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { API_URL } from '../../../../core/config/api.config';
import { CreateTransactionCommand } from '../../models/create-transaction.command';
import { UpdateTransactionCommand } from '../../models/update-transaction.command';
import { ApiEndpoints } from '../../../../shared/constants/api-endpoints';
import { ImportTransactionsResult } from '../../models/import-transactions-result.model';

@Service()
export class Transaction {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = inject(API_URL);

    create(command: CreateTransactionCommand) {
        return this.http.post<Transaction>(`${this.apiUrl}${ApiEndpoints.transactions}`, command);
    }

    update(command: UpdateTransactionCommand) {
        return this.http.put<Transaction>(
        `${this.apiUrl}${ApiEndpoints.transactions}/${command.id}`,
        command
        );
    }

    delete(id: string) {
        return this.http.delete(`${this.apiUrl}${ApiEndpoints.transactions}/${id}`);
    }

    import(commands: readonly CreateTransactionCommand[]) {
        return this.http.post<ImportTransactionsResult>(
            `${this.apiUrl}${ApiEndpoints.transactions}/import`,
            { transactions: commands }
        );
    }
}
