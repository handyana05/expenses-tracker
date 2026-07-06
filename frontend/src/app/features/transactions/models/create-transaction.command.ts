export interface CreateTransactionCommand {
  categoryId: string;
  amount: number;
  transactionDate: string;
  description?: string | null;
}