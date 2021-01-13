import { BaseService } from "../base-service";
import { UserInterface as User } from "./model";

export class UsersService extends BaseService<User> {
  private table = "users";

  async createUser(user: User): Promise<User> {
    return await super.createOne({ table: this.table, tableValues: user });
  }

  async deleteUser(id: string): Promise<boolean> {
    return await super.deleteOne({ table: this.table, where: { id } });
  }

  // GraphQL methods
  async gqlFindOneUser(query: string): Promise<User> {
    return super.one<User>(query);
  }

  async gqlFindManyUsers(query: string): Promise<User[]> {
    return super.many<User>(query);
  }

  async gqlCreateUserBill({ userId, billId }): Promise<boolean> {
    return super.createJoinTable({
      idOne: { user_id: userId },
      idTwo: { bill_id: billId },
      table: this.table,
    });
  }

  async gqlDeleteUserBill({ userId, billId }): Promise<boolean> {
    return super.deleteJoinTable({
      idOne: { user_id: userId },
      idTwo: { bill_id: billId },
      table: this.table,
    });
  }

  async gqlCreateUserCategory({ userId, categoryId }): Promise<boolean> {
    return super.createJoinTable({
      idOne: { user_id: userId },
      idTwo: { category_id: categoryId },
      table: "user_bills",
    });
  }

  async gqlDeleteUserCategory({ userId, categoryId }): Promise<boolean> {
    return super.deleteJoinTable({
      idOne: { user_id: userId },
      idTwo: { category_id: categoryId },
      table: "user_categories",
    });
  }
}
