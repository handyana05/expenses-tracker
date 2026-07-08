import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Categories } from './categories';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoryFacade } from './services/category-facade/category-facade';
import { API_URL } from '../../core/config/api.config';
import { provideHttpClient } from '@angular/common/http';
import { CategoryType } from '../../shared/models/category-type.model';
import { of } from 'rxjs';

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
        {
          provide: API_URL,
          useValue: apiUrl,
        },
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
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create category when form is valid', () => {
    facadeMock.create.mockReturnValue(of({}));

    component.form.setValue({
      name: 'Food',
      type: CategoryType.Expense,
    });

    component.createCategory();

    expect(facadeMock.create).toHaveBeenCalledWith({
      name: 'Food',
      type: CategoryType.Expense,
    });

    expect(component.form.getRawValue()).toEqual({
      name: '',
      type: CategoryType.Expense,
    });
  });

  it('should not create category when form is invalid', () => {
    component.form.setValue({
      name: '',
      type: CategoryType.Expense,
    });

    component.createCategory();

    expect(facadeMock.create).not.toHaveBeenCalled();
  });

  it('should populate form when editing category', () => {
    component.editCategory({
      id: 'category-id',
      name: 'Salary',
      type: CategoryType.Income,
    });

    expect(component.form.getRawValue()).toEqual({
      name: 'Salary',
      type: CategoryType.Income,
    });

    expect(component.isEditing).toBe(true);
  });

  it('should update category when editing', () => {
    facadeMock.update.mockReturnValue(of({}));

    component.editCategory({
      id: 'category-id',
      name: 'Salary',
      type: CategoryType.Income,
    });

    component.createCategory();

    expect(facadeMock.update).toHaveBeenCalledWith({
      id: 'category-id',
      name: 'Salary',
      type: CategoryType.Income,
    });

    expect(facadeMock.create).not.toHaveBeenCalled();

    expect(component.form.getRawValue()).toEqual({
      name: '',
      type: CategoryType.Expense,
    });

    expect(component.isEditing).toBe(false);
  });

  it('should cancel editing', () => {
    component.editCategory({
      id: 'category-id',
      name: 'Salary',
      type: CategoryType.Income,
    });

    component.cancelEdit();

    expect(component.form.getRawValue()).toEqual({
      name: '',
      type: CategoryType.Expense,
    });

    expect(component.isEditing).toBe(false);
  });

  it('should delete category when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    facadeMock.delete.mockReturnValue(of({}));

    component.deleteCategory('category-id');

    expect(window.confirm).toHaveBeenCalled();
    expect(facadeMock.delete).toHaveBeenCalledWith('category-id');
  });

  it('should not delete category when confirmation is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteCategory('category-id');

    expect(facadeMock.delete).not.toHaveBeenCalled();
  });
});
