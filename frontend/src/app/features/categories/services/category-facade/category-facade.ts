import { inject, Service, signal } from '@angular/core';
import { Category } from '../category/category';
import { CreateCategoryCommand } from '../../models/create-category.command';
import { UpdateCategoryCommand } from '../../models/update-category.command';
import { finalize, Observable, tap } from 'rxjs';

@Service()
export class CategoryFacade {
    private readonly categoryService = inject(Category);

    readonly creating = signal(false);
    readonly updating = signal(false);
    readonly deleting = signal(false);
    readonly error = signal<string | null>(null);

    create(command: CreateCategoryCommand): Observable<Object> {
        this.creating.set(true);
        this.error.set(null);

        return this.categoryService.create(command).pipe(
            tap({
                error: () => this.error.set('Could not create category.')
            }),
            finalize(() => this.creating.set(false))
        );
    }

    update(command: UpdateCategoryCommand): Observable<Object> {
        this.updating.set(true);
        this.error.set(null);

        return this.categoryService.update(command).pipe(
            tap({
                error: () => this.error.set('Could not update category.')
            }),
            finalize(() => this.updating.set(false))
        );
    }

    delete(id: string): Observable<Object> {
        this.deleting.set(true);
        this.error.set(null);

        return this.categoryService.delete(id).pipe(
            tap({
                error: () => this.error.set('Could not delete category.')
            }),
            finalize(() => this.deleting.set(false))
        );
    }
}
