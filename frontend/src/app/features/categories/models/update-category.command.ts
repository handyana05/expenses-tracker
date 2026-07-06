import { CategoryType } from "./category-type.model";

export interface UpdateCategoryCommand {
  id: string;
  name: string;
  type: CategoryType;
}