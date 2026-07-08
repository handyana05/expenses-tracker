import { CategoryType } from "../../../shared/models/category-type.model";

export interface UpdateCategoryCommand {
  id: string;
  name: string;
  type: CategoryType;
}