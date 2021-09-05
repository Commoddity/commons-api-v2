import { BaseService } from "@services";

import { Bill } from "./model";
import { Collection as BillCollection } from "./collection";

export class BillsService extends BaseService<Bill> {
  constructor() {
    super(BillCollection, Bill);
  }

  async createBill(bill: Bill): Promise<Bill> {
    return super.createOne(bill);
  }

  async createManyBills(bills: Bill[]): Promise<Bill[]> {
    return super.createMany(bills);
  }

  async deleteBill(query: PQuery): Promise<void> {
    return super.deleteOne(query);
  }

  async updateBillPassed({ code, passed }: UpdatePassedParams): Promise<Bill> {
    return super.updateOne({ code }, { passed });
  }

  async updateSummaryUrl({
    code,
    summary_url,
  }: UpdateSummaryParams): Promise<Bill> {
    return await super.updateOne({ code }, { summary_url });
  }

  async updateSummaryUrls(billSummaryMaps: BillSummaryMap[]): Promise<number> {
    let billsUpdated = 0;

    const billCodes = billSummaryMaps.map(({ code }) => code);
    const billsWithNoSummary = await this.findMany({
      $and: [{ code: { $in: billCodes } }, { summary_url: null }],
    });

    for await (const { code, url: summary_url } of billSummaryMaps) {
      const billToUpdate = billsWithNoSummary.find(
        (bill) => bill.code === code,
      );
      if (billToUpdate) {
        await this.updateOne({ _id: billToUpdate.id }, { summary_url });
        billsUpdated++;
      }
    }

    return billsUpdated;
  }

  async addBillCategory({
    code,
    category,
  }: PUpdateBillCategories): Promise<Bill> {
    return this.updatePush({ code }, { categories: category });
  }

  async removeBillCategory({
    code,
    category,
  }: PUpdateBillCategories): Promise<Bill> {
    return this.updatePull({ code }, { categories: category });
  }
}
