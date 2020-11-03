import { BaseService } from "../base-service";
import { Bill } from "./model";

export class ParliamentsService extends BaseService<Bill> {
  // async createBill(bill: Bill): Promise<Bill | undefined> {
  //   return await super.createOne({ table: "bills", tableValues: bill });
  // }

  async queryLatestParliamentarySession(): Promise<string | undefined> {
    return await super.findLatest({ table: `parliamentary_sessions` });
  }
}
