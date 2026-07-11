import { TestBed } from '@angular/core/testing';

import { Category } from './category';
import { UpdateCategoryCommand } from '../../models/update-category.command';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL } from '../../../../core/config/api.config';
import { CreateCategoryCommand } from '../../models/create-category.command';
import { CategoryType } from '../../../../shared/models/category-type.model';

describe('Category', () => {
  let service: Category;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://localhost:7115/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Category,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: apiUrl },
      ],
    });

    service = TestBed.inject(Category);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a category', () => {
    const command: CreateCategoryCommand = {
      name: 'Food',
      type: CategoryType.Expense,
    };

    service.create(command).subscribe();

    const request = httpMock.expectOne(`${apiUrl}/categories`);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Food',
      type: 2,
    });

    request.flush({});
  });

  it('should update a category', () => {
    const command: UpdateCategoryCommand = {
      id: 'category-id',
      name: 'Salary',
      type: CategoryType.Income,
    };

    service.update(command).subscribe();

    const request = httpMock.expectOne(`${apiUrl}/categories/${command.id}`);

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({
      id: 'category-id',
      name: 'Salary',
      type: 1,
    });

    request.flush({});
  });

  it('should delete a category', () => {
    const id = 'category-id';

    service.delete(id).subscribe();

    const request = httpMock.expectOne(`${apiUrl}/categories/${id}`);

    expect(request.request.method).toBe('DELETE');

    request.flush({});
  });

  it('should keep category enum values aligned with the backend contract', () => {
    expect(CategoryType.Income).toBe(1);
    expect(CategoryType.Expense).toBe(2);
  });
});
