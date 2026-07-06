import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { API_URL } from '../../../../core/config/api.config';
import { CreateTransactionCommand } from '../../models/create-transaction.command';
import { UpdateTransactionCommand } from '../../models/update-transaction.command';

@Service()
export class Transaction {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = inject(API_URL);

    create(command: CreateTransactionCommand) {
        return this.http.post<Transaction>(`${this.apiUrl}/transactions`, command);
    }

    update(command: UpdateTransactionCommand) {
        return this.http.put<Transaction>(
        `${this.apiUrl}/transactions/${command.id}`,
        command
        );
    }

    delete(id: string) {
        return this.http.delete(`${this.apiUrl}/transactions/${id}`);
    }
}
