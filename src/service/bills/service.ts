import { BaseService, CategoriesService, Category } from "@services";
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

  async updateBillPassed({ code, passed }: UpdatePassedParams): Promise<Bill> {
    return await super.updateOne({
      table: this.table,
      data: { code, passed },
    });
  }

  async updateSummaryUrl({
    code,
    summary_url,
  }: UpdateSummaryParams): Promise<Bill> {
    return await super.updateOne({
      table: this.table,
      data: { code, summary_url },
    });
  }

  async updateSummaryUrls(billSummaryMaps: BillSummaryMap[]): Promise<number> {
    let billsUpdated = 0;

    const whereCondition = billSummaryMaps.map(({ code }) => {
      return { code };
    });

    const billsWithSummaries = await this.findManyBills(whereCondition, "OR");
    const billsWithNewSummaries = billsWithSummaries
      ?.filter(({ summary_url }) => !summary_url)
      ?.map(({ code }) => code);

    if (billsWithNewSummaries.length) {
      const updateData = billSummaryMaps
        .filter(({ code }) => billsWithNewSummaries.includes(code))
        .map(({ code, url: summary_url }) => {
          return { code, summary_url };
        });

      await this.updateManyBills(updateData);
      billsUpdated = billsWithNewSummaries.length;
    }

    return billsUpdated;
  }

  async updateBillCategories({
    code,
    categories,
  }: UpdateBillCategoriesParams): Promise<boolean> {
    try {
      const bill = await super.findOne<Bill>({
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

  async updateManyBills(data: { [key: string]: any }[]): Promise<Bill[]> {
    return await super.updateMany({ table: this.table, data });
  }

  async findBill(code: string): Promise<Bill> {
    return await super.findOne({ table: this.table, where: { code } });
  }

  async findManyBills(
    where: WhereCondition,
    operator: "AND" | "OR",
  ): Promise<Bill[]> {
    return await super.findMany({ table: this.table, where, operator });
  }

  // GraphQL methods
  async gqlFindOneBill(query: string): Promise<Bill> {
    return super.one<Bill>(query);
  }

  async gqlFindManyBills(query: string): Promise<Bill[]> {
    return super.many<Bill>(query);
  }
}
