import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Transactions } from './transactions';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL } from '../../core/config/api.config';

describe('Transactions', () => {
  let component: Transactions;
  let fixture: ComponentFixture<Transactions>;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://localhost:7115/api';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Transactions],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: apiUrl },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Transactions);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    httpMock.expectOne(`${apiUrl}/categories`).flush([]);
    httpMock.expectOne(`${apiUrl}/transactions`).flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
