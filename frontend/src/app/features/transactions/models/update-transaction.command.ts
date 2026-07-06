export interface UpdateTransactionCommand {
  id: string;
  categoryId: string;
  amount: number;
  transactionDate: string;
  description?: string | null;
}