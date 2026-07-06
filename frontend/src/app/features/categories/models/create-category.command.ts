import { CategoryType } from "./category-type.model";

export interface CreateCategoryCommand {
    name: string;
    type: CategoryType;
}