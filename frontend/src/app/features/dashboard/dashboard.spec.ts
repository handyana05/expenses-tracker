import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL } from '../../core/config/api.config';
import { CategoryType } from '../../shared/models/category-type.model';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://localhost:7115/api';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: API_URL,
          useValue: apiUrl,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const now = new Date();
    httpMock
      .expectOne(`${apiUrl}/reports/monthly-summary?year=${now.getFullYear()}&month=${now.getMonth() + 1}`)
      .flush({ totalIncome: 2500, totalExpenses: 900, balance: 1600 });
    httpMock.expectOne(`${apiUrl}/transactions`).flush([
      {
        id: 'transaction-id',
        categoryId: 'category-id',
        categoryName: 'Salary',
        categoryType: CategoryType.Income,
        amount: 2500,
        transactionDate: '2026-07-01T00:00:00Z',
        description: 'Monthly salary',
      },
    ]);

    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should present recent transactions with direction and signed amount', () => {
    const item: HTMLElement = fixture.nativeElement.querySelector('.transaction-item');

    expect(item.textContent).toContain('Salary');
    expect(item.textContent).toContain('Monthly salary');
    expect(item.textContent).toContain('+');
    expect(item.querySelector('.amount--income')).not.toBeNull();
  });
});
