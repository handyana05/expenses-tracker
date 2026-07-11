import { Category } from '../categories/models/category.model';
import { CategoryType } from '../../shared/models/category-type.model';
import { CreateTransactionCommand } from './models/create-transaction.command';
import { Transaction } from './models/transaction.model';

const headers = ['Date', 'Category', 'Type', 'Amount', 'Description'];

export class TransactionCsv {
  static serialize(transactions: readonly Transaction[]): string {
    const rows = transactions.map((transaction) => [
      transaction.transactionDate.slice(0, 10),
      transaction.categoryName ?? '',
      transaction.categoryType === CategoryType.Income ? 'Income' : 'Expense',
      transaction.amount.toString(),
      transaction.description ?? '',
    ]);

    return [headers, ...rows]
      .map((row) => row.map((value) => this.escape(value)).join(','))
      .join('\r\n');
  }

  static parse(
    content: string,
    categories: readonly Category[]
  ): CreateTransactionCommand[] {
    const rows = this.parseRows(content.replace(/^\uFEFF/, ''))
      .filter((row) => row.some((value) => value.trim().length > 0));

    if (rows.length < 2) {
      throw new Error('The CSV file does not contain any transactions.');
    }

    if (rows.length - 1 > 500) {
      throw new Error('A CSV import cannot contain more than 500 transactions.');
    }

    const actualHeaders = rows[0].map((value) => value.trim());
    if (actualHeaders.length !== headers.length ||
        actualHeaders.some((value, index) => value !== headers[index])) {
      throw new Error(`Expected CSV headers: ${headers.join(', ')}.`);
    }

    return rows.slice(1).map((row, index) =>
      this.parseTransaction(row, index + 2, categories)
    );
  }

  private static parseTransaction(
    row: string[],
    rowNumber: number,
    categories: readonly Category[]
  ): CreateTransactionCommand {
    if (row.length !== headers.length) {
      throw new Error(`Row ${rowNumber} must contain exactly five columns.`);
    }

    const [date, categoryName, typeText, amountText, description] =
      row.map((value) => value.trim());
    const type = typeText.toLowerCase() === 'income'
      ? CategoryType.Income
      : typeText.toLowerCase() === 'expense'
        ? CategoryType.Expense
        : null;

    if (!type) {
      throw new Error(`Row ${rowNumber} has an invalid transaction type.`);
    }

    const category = categories.find((candidate) =>
      candidate.type === type &&
      candidate.name.localeCompare(categoryName, undefined, { sensitivity: 'accent' }) === 0
    );

    if (!category) {
      throw new Error(
        `Row ${rowNumber} references an unknown ${typeText} category: ${categoryName}.`
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
      throw new Error(`Row ${rowNumber} has an invalid date. Use YYYY-MM-DD.`);
    }

    const amount = Number(amountText);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(`Row ${rowNumber} has an invalid amount.`);
    }

    if (description.length > 500) {
      throw new Error(`Row ${rowNumber} has a description longer than 500 characters.`);
    }

    return {
      categoryId: category.id,
      amount,
      transactionDate: new Date(`${date}T00:00:00Z`).toISOString(),
      description: description || null,
    };
  }

  private static parseRows(content: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let value = '';
    let quoted = false;

    for (let index = 0; index < content.length; index += 1) {
      const character = content[index];

      if (character === '"') {
        if (quoted && content[index + 1] === '"') {
          value += '"';
          index += 1;
        } else {
          quoted = !quoted;
        }
      } else if (character === ',' && !quoted) {
        row.push(value);
        value = '';
      } else if ((character === '\n' || character === '\r') && !quoted) {
        if (character === '\r' && content[index + 1] === '\n') {
          index += 1;
        }
        row.push(value);
        rows.push(row);
        row = [];
        value = '';
      } else {
        value += character;
      }
    }

    if (quoted) {
      throw new Error('The CSV file contains an unterminated quoted value.');
    }

    if (value.length > 0 || row.length > 0) {
      row.push(value);
      rows.push(row);
    }

    return rows;
  }

  private static escape(value: string): string {
    return /[",\r\n]/.test(value)
      ? `"${value.replaceAll('"', '""')}"`
      : value;
  }
}
