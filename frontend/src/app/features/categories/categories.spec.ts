import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Categories } from './categories';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoryFacade } from './services/category-facade/category-facade';
import { API_URL } from '../../core/config/api.config';
import { provideHttpClient } from '@angular/common/http';

describe('Categories', () => {
  let fixture: ComponentFixture<Categories>;
  let component: Categories;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://localhost:7115/api';

  const facadeMock = {
    creating: vi.fn(() => false),
    updating: vi.fn(() => false),
    deleting: vi.fn(() => false),
    error: vi.fn(() => null),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Categories],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: apiUrl },
      ],
    })
      .overrideComponent(Categories, {
        set: {
          providers: [
            {
              provide: CategoryFacade,
              useValue: facadeMock,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Categories);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    const initialRequest = httpMock.expectOne(`${apiUrl}/categories`);
    initialRequest.flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create category when form is valid', () => {
    facadeMock.create.mockImplementation((_command, onSuccess) => {
      onSuccess?.();
    });

    component.form.setValue({
      name: 'Food',
      type: 'Expense',
    });

    component.createCategory();

    expect(facadeMock.create).toHaveBeenCalledWith(
      {
        name: 'Food',
        type: 'Expense',
      },
      expect.any(Function)
    );

    expect(component.form.getRawValue()).toEqual({
      name: '',
      type: 'Expense',
    });
  });

  it('should update category when editing', () => {
    facadeMock.update.mockImplementation((_command, onSuccess) => {
      onSuccess?.();
    });

    component.editCategory({
      id: 'category-id',
      name: 'Salary',
      type: 'Income',
    });

    component.createCategory();

    expect(facadeMock.update).toHaveBeenCalledOnce();

    expect(facadeMock.update).toHaveBeenCalledWith(
      {
        id: 'category-id',
        name: 'Salary',
        type: 'Income',
      },
      expect.any(Function)
    );

    expect(facadeMock.create).not.toHaveBeenCalled();

    expect(component.form.getRawValue()).toEqual({
      name: '',
      type: 'Expense',
    });

    expect(component.isEditing).toBe(false);
  });

  it('should delete category when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    facadeMock.delete.mockImplementation((_id, onSuccess) => {
      onSuccess?.();
    });

    component.deleteCategory('category-id');

    expect(window.confirm).toHaveBeenCalled();

    expect(facadeMock.delete).toHaveBeenCalledWith(
      'category-id',
      expect.any(Function)
    );
  });

  it('should not delete category when confirmation is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteCategory('category-id');

    expect(facadeMock.delete).not.toHaveBeenCalled();
  });

  it('should populate the form when editing', () => {
    component.editCategory({
      id: 'category-id',
      name: 'Salary',
      type: 'Income',
    });

    expect(component.form.getRawValue()).toEqual({
      name: 'Salary',
      type: 'Income',
    });

    expect(component.isEditing).toBe(true);
  });
});
