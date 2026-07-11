import { CategoryType } from '../../shared/models/category-type.model';
import { TransactionCsv } from './transaction-csv';

describe('TransactionCsv', () => {
  const categories = [
    { id: 'food-id', name: 'Food', type: CategoryType.Expense },
    { id: 'salary-id', name: 'Salary', type: CategoryType.Income },
  ];

  it('should serialize and escape transaction values', () => {
    const csv = TransactionCsv.serialize([{
      id: 'transaction-id',
      categoryId: 'food-id',
      categoryName: 'Food',
      categoryType: CategoryType.Expense,
      amount: 12.5,
      transactionDate: '2026-07-11T00:00:00Z',
      description: 'Lunch, with a friend',
    }]);

    expect(csv).toContain('Date,Category,Type,Amount,Description');
    expect(csv).toContain('2026-07-11,Food,Expense,12.5,"Lunch, with a friend"');
  });

  it('should parse valid transactions and resolve owned categories', () => {
    const result = TransactionCsv.parse(
      'Date,Category,Type,Amount,Description\n2026-07-11,Food,Expense,12.50,Lunch',
      categories
    );

    expect(result).toEqual([{
      categoryId: 'food-id',
      amount: 12.5,
      transactionDate: '2026-07-11T00:00:00.000Z',
      description: 'Lunch',
    }]);
  });

  it('should reject unknown categories', () => {
    expect(() => TransactionCsv.parse(
      'Date,Category,Type,Amount,Description\n2026-07-11,Travel,Expense,12.50,Train',
      categories
    )).toThrow(/unknown Expense category/);
  });
});
