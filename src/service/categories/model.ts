import { keys } from "ts-transformer-keys";

export interface CategoryInterface {
  id: string;
  name: string;
  uclassify_class: string;
}

export class Category implements CategoryInterface {
  id: string;
  name: string;
  uclassify_class: string;

  static getColumnNames(): string[] {
    return keys<CategoryInterface>();
  }

  constructor({ id, name, uclassify_class }) {
    this.id = id;
    this.name = name;
    this.uclassify_class = uclassify_class;
  }
}
