import { BaseService } from "../base-service";

import { Category } from "./model";

export class CategoriesService extends BaseService<Category> {
  private table = "categories";

  async findOneCategory(category: string): Promise<Category> {
    return await super.findOne({
      table: this.table,
      whereClause: { class_code: category },
    });
  }
}
