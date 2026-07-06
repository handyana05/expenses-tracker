import { CategoryType } from "./category-type.model";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
}