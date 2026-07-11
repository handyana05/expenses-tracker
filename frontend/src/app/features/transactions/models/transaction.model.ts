import { CategoryType } from '../../../shared/models/category-type.model';

export interface Transaction {
  id: string;
  categoryId: string;
  categoryName?: string | null;
  categoryType: CategoryType;
  amount: number;
  transactionDate: string;
  description?: string | null;
}
