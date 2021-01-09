import { BaseService } from "../base-service";

import { Category } from "./model";

export class CategoriesService extends BaseService<Category> {
  private table = "categories";

  async findOneCategory(category: string): Promise<Category> {
    return await super.findOne({
      table: this.table,
      where: { class_code: category },
    });
  }
}
