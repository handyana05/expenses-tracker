import { inject, Service, signal } from '@angular/core';
import { Category } from '../category/category';
import { CreateCategoryCommand } from '../../models/create-category.command';
import { UpdateCategoryCommand } from '../../models/update-category.command';

@Service()
export class CategoryFacade {
    private readonly categoryService = inject(Category);

    readonly creating = signal(false);
    readonly updating = signal(false);
    readonly deleting = signal(false);
    readonly error = signal<string | null>(null);

    create(command: CreateCategoryCommand, onSuccess?: () => void): void {
        this.creating.set(true);
        this.error.set(null);

        this.categoryService.create(command).subscribe({
            next: () => {
                onSuccess?.();
            },
            error: () => {
                this.error.set('Could not create category.');
                this.creating.set(false);
            },
            complete: () => {
                this.creating.set(false);
            }
        });
    }

    update(command: UpdateCategoryCommand, onSuccess?: () => void) {
        this.updating.set(true);
        this.error.set(null);

        this.categoryService.update(command).subscribe({
            next: () => {
                onSuccess?.();
            },
            error: () => {
                this.error.set('Could not update category.');
                this.updating.set(false);
            },
            complete: () => {
                this.updating.set(false);
            }
        });
    }

    delete(id: string, onSuccess?: () => void) {
        this.deleting.set(true);
        this.error.set(null);

        this.categoryService.delete(id).subscribe({
            next: () => {
                onSuccess?.();
            },
            error: () => {
                this.error.set('Could not delete category.');
                this.deleting.set(false);
            },
            complete: () => {
                this.deleting.set(false);
            }
        });
    }
}
