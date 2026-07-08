import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { API_URL } from '../../../../core/config/api.config';
import { CreateCategoryCommand } from '../../models/create-category.command';
import { UpdateCategoryCommand } from '../../models/update-category.command';
import { CategoryType } from '../../../../shared/models/category-type.model';
import { CreateCategoryRequest } from '../../models/create-category.request';
import { UpdateCategoryRequest } from '../../models/update-category.request';

@Service()
export class Category {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = inject(API_URL);

    create(command: CreateCategoryCommand) {
        const request: CreateCategoryRequest = {
            name: command.name,
            type: command.type,
        };
        return this.http.post(`${this.apiUrl}/categories`, request);
    }

    update(command: UpdateCategoryCommand) {
        const request: UpdateCategoryRequest = {
            id: command.id,
            name: command.name,
            type: command.type,
        };

        return this.http.put<Category>(
            `${this.apiUrl}/categories/${command.id}`,
            request
        );
    }

    delete(id: string) {
        return this.http.delete(
            `${this.apiUrl}/categories/${id}`
        );
    }
}
