import { BaseService } from "../base-service";
import { CategoriesService, Category } from "../categories";

import { BillInterface as Bill } from "./model";

export class BillsService extends BaseService<Bill> {
  private table = "bills";

  async createBill(bill: Bill): Promise<Bill> {
    return await super.createOne({ table: this.table, tableValues: bill });
  }

  async createManyBills(bills: Bill[]): Promise<Bill[]> {
    return await super.createMany({
      table: this.table,
      tableValuesArray: bills,
    });
  }

  async deleteBill(code: string): Promise<boolean> {
    return await super.deleteOne({ table: this.table, where: { code } });
  }

  async updateBillPassed({
    code,
    passed,
  }: {
    code: string;
    passed: boolean;
  }): Promise<Bill> {
    return await super.updateOne({
      table: this.table,
      data: { code, passed },
    });
  }

  async updateSummaryUrl({
    code,
    summary_url,
  }: {
    code: string;
    summary_url: string;
  }): Promise<Bill> {
    return await super.updateOne({
      table: this.table,
      data: { code, summary_url },
    });
  }

  async updateBillCategories({
    code,
    categories,
  }: UpdateBillCategoriesParams): Promise<boolean> {
    try {
      const bill = await super.findOne({
        table: this.table,
        where: { code },
      });

      const tableValuesArray: BillCategory[] = [];

      for await (const billCategory of categories) {
        const category: Category = await new CategoriesService().findOneCategory(
          billCategory,
        );

        if (!!bill?.id && !!category?.id) {
          tableValuesArray.push({ bill_id: bill.id, category_id: category.id });
        } else {
          throw new Error(`Unable to find Bill or Category.`);
        }
      }

      await super.createJoinTables<BillCategory>({
        table: "bill_categories",
        tableValuesArray,
      });
      return true;
    } catch (err) {
      throw new Error(`[BILL CATEGORY UPDATE ERROR]: ${err}`);
    }
  }

  async findBill(code: string): Promise<Bill> {
    return await super.findOne({ table: this.table, where: { code } });
  }
}
