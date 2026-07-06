import { TestBed } from '@angular/core/testing';

import { TransactionFacade } from './transaction-facade';

describe('TransactionFacade', () => {
  let service: TransactionFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
