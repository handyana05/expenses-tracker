import { CategoryType } from "../../../shared/models/category-type.model";

export interface CreateCategoryCommand {
    name: string;
    type: CategoryType;
}