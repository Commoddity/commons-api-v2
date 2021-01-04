import { keys } from "ts-transformer-keys";

export interface CategoryInterface {
  id: string;
  name: string;
  class_code: string;
}

export class Category implements CategoryInterface {
  id: string;
  name: string;
  class_code: string;

  static getColumnNames(): string[] {
    return keys<CategoryInterface>();
  }

  constructor({ id, name, class_code }) {
    this.id = id;
    this.name = name;
    this.class_code = class_code;
  }
}
