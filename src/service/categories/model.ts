import { keys } from "ts-transformer-keys";

export interface CategoryInterface {
  id?: string;
  name: string;
  class_code: string;
  created_at?: Date;
}

export class Category implements CategoryInterface {
  id?: string;
  name: string;
  class_code: string;
  created_at?: Date;

  static getColumnNames(): string[] {
    return keys<CategoryInterface>();
  }

  constructor({ id, name, class_code, created_at }) {
    this.id = id;
    this.name = name;
    this.class_code = class_code;
    this.created_at = created_at;
  }
}
