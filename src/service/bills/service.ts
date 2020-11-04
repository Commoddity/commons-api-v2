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

  private createBillsArray = async (bills: Bill[]): Promise<Bill[]> => {
    const parliamentarySession = await new ParliamentsService().queryLatestParliamentarySession();

    return bills.map((bill) => {
      const billObject: Bill = {
        parliamentary_session_id: undefined,
        code: undefined,
        title: undefined,
        description: undefined,
        introduced_date: undefined,
        summary_url: undefined,
        page_url: undefined,
        full_text_url: undefined,
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
