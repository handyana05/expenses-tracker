import { TestBed } from '@angular/core/testing';

import { CategoryFacade } from './category-facade';
import { Category } from '../category/category';
import { CreateCategoryCommand } from '../../models/create-category.command';
import { UpdateCategoryCommand } from '../../models/update-category.command';
import { CategoryType } from '../../../../shared/models/category-type.model';
import { of, throwError } from 'rxjs';

describe('CategoryFacade', () => {
  let facade: CategoryFacade;

  const categoryServiceMock = {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        CategoryFacade,
        {
          provide: Category,
          useValue: categoryServiceMock,
        },
      ],
    });

    facade = TestBed.inject(CategoryFacade);
  });

  it('should create category successfully', () => {
    const command: CreateCategoryCommand = {
      name: 'Food',
      type: CategoryType.Expense,
    };

    categoryServiceMock.create.mockReturnValue(of({}));

    facade.create(command).subscribe();

    expect(categoryServiceMock.create).toHaveBeenCalledWith(command);
    expect(facade.creating()).toBe(false);
    expect(facade.error()).toBeNull();
  });

  it('should set error when create fails', () => {
    const command: CreateCategoryCommand = {
      name: 'Food',
      type: CategoryType.Expense,
    };

    categoryServiceMock.create.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    facade.create(command).subscribe({
      error: () => {
        expect(facade.creating()).toBe(false);
        expect(facade.error()).toBe('Could not create category.');
      },
    });
  });

  it('should update category successfully', () => {
    const command: UpdateCategoryCommand = {
      id: 'category-id',
      name: 'Salary',
      type: CategoryType.Income,
    };

    categoryServiceMock.update.mockReturnValue(of({}));

    facade.update(command).subscribe();

    expect(categoryServiceMock.update).toHaveBeenCalledWith(command);
    expect(facade.updating()).toBe(false);
    expect(facade.error()).toBeNull();
  });

  it('should set error when update fails', () => {
    const command: UpdateCategoryCommand = {
      id: 'category-id',
      name: 'Salary',
      type: CategoryType.Income,
    };

    categoryServiceMock.update.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    facade.update(command).subscribe({
      error: () => {
        expect(facade.updating()).toBe(false);
        expect(facade.error()).toBe('Could not update category.');
      },
    });
  });

  it('should delete category successfully', () => {
    categoryServiceMock.delete.mockReturnValue(of({}));

    facade.delete('category-id').subscribe();

    expect(categoryServiceMock.delete).toHaveBeenCalledWith('category-id');
    expect(facade.deleting()).toBe(false);
    expect(facade.error()).toBeNull();
  });

  it('should set error when delete fails', () => {
    categoryServiceMock.delete.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    facade.delete('category-id').subscribe({
      error: () => {
        expect(facade.deleting()).toBe(false);
        expect(facade.error()).toBe('Could not delete category.');
      },
    });
  });
});
