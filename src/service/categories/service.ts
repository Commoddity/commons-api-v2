import { BaseService } from "../base-service";

import { CategoryInterface as Category } from "./model";

export class CategoriesService extends BaseService<Category> {
  private table = "categories";

  async findOneCategory(category: string): Promise<Category> {
    return await super.findOne({
      table: this.table,
      where: { class_code: category },
    });
  }

  // GraphQL methods
  async gqlFindOneCategory(query: string): Promise<Category> {
    return super.one<Category>(query);
  }

  async gqlFindManyCategories(query: string): Promise<Category[]> {
    return super.many<Category>(query);
  }
}
