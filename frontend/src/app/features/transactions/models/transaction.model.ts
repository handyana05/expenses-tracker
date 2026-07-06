export interface Transaction {
  id: string;
  categoryId: string;
  categoryName?: string | null;
  amount: number;
  transactionDate: string;
  description?: string | null;
}