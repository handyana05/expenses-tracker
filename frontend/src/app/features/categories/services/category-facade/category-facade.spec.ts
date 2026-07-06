import { TestBed } from '@angular/core/testing';

import { CategoryFacade } from './category-facade';
import { Category } from '../category/category';
import { CreateCategoryCommand } from '../../models/create-category.command';
import { UpdateCategoryCommand } from '../../models/update-category.command';
import { of, throwError } from 'rxjs';

describe('CategoryFacade', () => {
  let facade: CategoryFacade;

  const categoryServiceMock = {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    categoryServiceMock.create.mockReset();
    categoryServiceMock.update.mockReset();
    categoryServiceMock.delete.mockReset();

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
      type: 'Expense',
    };

    const onSuccess = vi.fn();

    categoryServiceMock.create.mockReturnValue(of({}));

    facade.create(command, onSuccess);

    expect(categoryServiceMock.create).toHaveBeenCalledWith(command);
    expect(onSuccess).toHaveBeenCalled();
    expect(facade.creating()).toBe(false);
    expect(facade.error()).toBeNull();
  });

  it('should set error when create fails', () => {
    const command: CreateCategoryCommand = {
      name: 'Food',
      type: 'Expense',
    };

    categoryServiceMock.create.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    facade.create(command);

    expect(facade.creating()).toBe(false);
    expect(facade.error()).toBe('Could not create category.');
  });

  it('should update category successfully', () => {
    const command: UpdateCategoryCommand = {
      id: 'category-id',
      name: 'Salary',
      type: 'Income',
    };

    const onSuccess = vi.fn();

    categoryServiceMock.update.mockReturnValue(of({}));

    facade.update(command, onSuccess);

    expect(categoryServiceMock.update).toHaveBeenCalledWith(command);
    expect(onSuccess).toHaveBeenCalled();
    expect(facade.updating()).toBe(false);
    expect(facade.error()).toBeNull();
  });

  it('should delete category successfully', () => {
    const onSuccess = vi.fn();

    categoryServiceMock.delete.mockReturnValue(of({}));

    facade.delete('category-id', onSuccess);

    expect(categoryServiceMock.delete).toHaveBeenCalledWith('category-id');
    expect(onSuccess).toHaveBeenCalled();
    expect(facade.deleting()).toBe(false);
    expect(facade.error()).toBeNull();
  });
});
