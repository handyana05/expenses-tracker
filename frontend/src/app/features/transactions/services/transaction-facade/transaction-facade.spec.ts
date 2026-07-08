import { TestBed } from '@angular/core/testing';

import { TransactionFacade } from './transaction-facade';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL } from '../../../../core/config/api.config';

describe('TransactionFacade', () => {
  let service: TransactionFacade;

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
    service = TestBed.inject(TransactionFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
