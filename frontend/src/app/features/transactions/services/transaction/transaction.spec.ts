import { TestBed } from '@angular/core/testing';

import { Transaction } from './transaction';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL } from '../../../../core/config/api.config';

describe('Transaction', () => {
  let service: Transaction;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { 
          provide: API_URL, 
          useValue: 'https://localhost:7115/api' 
        },
      ]
    });
    service = TestBed.inject(Transaction);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
