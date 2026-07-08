import { CategoryType } from "../../../shared/models/category-type.model";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
}