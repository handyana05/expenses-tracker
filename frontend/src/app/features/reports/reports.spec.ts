import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reports } from './reports';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL } from '../../core/config/api.config';

describe('Reports', () => {
  let component: Reports;
  let fixture: ComponentFixture<Reports>;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://localhost:7115/api';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reports],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: apiUrl },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Reports);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    httpMock
      .expectOne(`${apiUrl}/reports/monthly-summary?year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}`)
      .flush({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
      });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
