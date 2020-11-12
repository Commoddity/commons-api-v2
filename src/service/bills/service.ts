import { BaseService } from "../base-service";
import { ParliamentsService } from "../parliaments";

import { Bill } from "./model";

export class BillsService extends BaseService<Bill> {
  async createBill(bill: Bill): Promise<Bill | undefined> {
    return await super.createOne({ table: "bills", tableValues: bill });
  }

  async createManyBills(bills: Bill[]): Promise<Bill[] | undefined> {
    // const billColumns = Bill.getColumnNames();

    const billValuesArray = await this.createBillsArray(bills);

    return await super.createMany({
      table: "bills",
      tableValuesArray: billValuesArray,
    });
  }

  async updateBillPassed({
    billCode,
    passed,
  }: {
    billCode: string;
    passed: boolean;
  }): Promise<boolean> {
    return await super.updateOne({
      table: "bills",
      column: "passed",
      value: passed.toString(),
      whereColumn: "code",
      whereValue: billCode,
    });
  }

  async updateSummaryUrl({
    billCode,
    summaryUrl,
  }: {
    billCode: string;
    summaryUrl: string;
  }): Promise<boolean> {
    return await super.updateOne({
      table: "bills",
      column: "summary_url",
      value: summaryUrl,
      whereColumn: "code",
      whereValue: billCode,
    });
  }

  private createBillsArray = async (bills: Bill[]): Promise<Bill[]> => {
    const parliamentarySession = await new ParliamentsService().queryLatestParliamentarySession();

    return bills.map((bill) => {
      const billObject: Bill = {
        parliamentary_session_id: undefined,
        code: "",
        title: "",
        description: "",
        introduced_date: "",
        summary_url: "",
        page_url: "",
        full_text_url: "",
        passed: undefined,
      };

      return Object.keys(billObject).reduce((billObject, billColumn, index) => {
        return (billObject = {
          ...billObject,
          [billColumn]: index === 0 ? parliamentarySession : bill[billColumn],
        });
      }, billObject);
    });
  };
}
