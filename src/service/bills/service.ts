import { BaseService } from "../base-service";
import { CategoriesService } from "../categories";

import { Bill, BillCategory } from "./model";

export class BillsService extends BaseService<Bill> {
  private table = "bills";

  async createBill(bill: Bill): Promise<Bill | undefined> {
    return await super.createOne({ table: this.table, tableValues: bill });
  }

  async createManyBills(bills: Bill[]): Promise<Bill[] | undefined> {
    // const billValuesArray = await this.createBillsArray(bills);

    return await super.createMany({
      table: this.table,
      tableValuesArray: bills,
    });
  }

  async updateBillPassed({
    billCode,
    passed,
  }: {
    billCode: string;
    passed: boolean;
  }): Promise<Bill | undefined> {
    return await super.updateOne({
      table: this.table,
      column: "passed",
      value: passed.toString(),
      where: { column: "code", value: billCode },
    });
  }

  async updateSummaryUrl({
    billCode,
    summaryUrl,
  }: {
    billCode: string;
    summaryUrl: string;
  }): Promise<Bill | undefined> {
    return await super.updateOne({
      table: this.table,
      column: "summary_url",
      value: summaryUrl,
      where: { column: "code", value: billCode },
    });
  }

  async updateBillCategories({
    billCode,
    categories,
  }: {
    billCode: string;
    categories: string[];
  }): Promise<boolean> {
    try {
      const bill = await super.findOne({
        table: this.table,
        where: { column: "code", value: billCode },
      });

      const tableValuesArray: BillCategory[] = [];

      for await (const billCategory of categories) {
        const category = await new CategoriesService().findOneCategory(
          billCategory,
        );

        if (!!bill?.id && !!category?.id) {
          tableValuesArray.push({ bill_id: bill.id, category_id: category.id });
        } else {
          throw new Error(`Unable to find Bill or Category.`);
        }
      }

      await super.createJoinTables({
        table: "bill_categories",
        tableValuesArray,
      });
      return true;
    } catch (err) {
      console.error(`[BILL CATEGORY UPDATE ERROR]: ${err}`);
      return false;
    }
  }

  /* This method is probably not necessary since */

  // private createBillsArray = async (bills: Bill[]): Promise<Bill[]> => {
  //   const parliamentarySession = await new ParliamentsService().queryLatestParliamentarySession();

  //   return bills.map((bill) => {
  //     const billObject: Bill = {
  //       parliamentary_session_id: undefined,
  //       code: "",
  //       title: "",
  //       description: "",
  //       introduced_date: "",
  //       summary_url: "",
  //       page_url: "",
  //       full_text_url: "",
  //       passed: undefined,
  //     };

  //     return Object.keys(billObject).reduce((billObject, billColumn, index) => {
  //       return (billObject = {
  //         ...billObject,
  //         [billColumn]: index === 0 ? parliamentarySession : bill[billColumn],
  //       });
  //     }, billObject);
  //   });
  // };
}
