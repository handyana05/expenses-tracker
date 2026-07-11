import { TestBed } from '@angular/core/testing';

import { Transaction } from './transaction';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL } from '../../../../core/config/api.config';
import { CreateTransactionCommand } from '../../models/create-transaction.command';

describe('Transaction', () => {
  let service: Transaction;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://localhost:7115/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { 
          provide: API_URL, 
          useValue: apiUrl
        },
      ]
    });
    service = TestBed.inject(Transaction);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should import transactions in one batch', () => {
    const commands: CreateTransactionCommand[] = [{
      categoryId: 'category-id',
      amount: 12.5,
      transactionDate: '2026-07-11T00:00:00.000Z',
      description: 'Lunch',
    }];

    service.import(commands).subscribe((result) => {
      expect(result.importedCount).toBe(1);
    });

    const request = httpMock.expectOne(`${apiUrl}/transactions/import`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ transactions: commands });
    request.flush({ importedCount: 1 });
  });
});
