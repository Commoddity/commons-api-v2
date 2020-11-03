import { BaseService } from "../base-service";
import { Bill } from "./model";

export class BillsService extends BaseService<Bill> {
  async createBill(bill: Bill): Promise<Bill | undefined> {
    return await super.createOne({ table: "bills", entityValues: bill });
  }
}
