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

  constructor({ id, name, class_code, created_at }) {
    this.id = id;
    this.name = name;
    this.class_code = class_code;
    this.created_at = created_at;
  }
}
