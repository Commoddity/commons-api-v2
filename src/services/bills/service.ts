import { BaseService, ParliamentsService } from "@services";
import {
  IBillSummaryMap,
  PBillEvent,
  PPassedUpdate,
  PQuery,
  PUpdateBillCategories,
  PUpdatePassed,
} from "@types";
import { FormatUtils } from "@utils";

import { Bill, BillEvent, BillInput, createBill } from "./model";
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

  async updateBillPassed({
    code,
    pageUrl,
    passed,
  }: PUpdatePassed): Promise<Bill> {
    const update: PPassedUpdate = { passed };
    if (passed) {
      update.passedDate = await BillInput.getPassedDate(pageUrl);
    }
    return super.updateOne({ code }, update);
  }

  async updateBillsAndEvents(billEventsArray: PBillEvent[]): Promise<void> {
    const parliamentarySessionId =
      await new ParliamentsService().queryLatestParliamentarySession();

    const sortedBillEventsArray = this.sortBillEventsByDate(billEventsArray);
    const createdBillIds: string[] = [];

    for await (const event of sortedBillEventsArray) {
      console.log("Processing Event:", event);
      const code = FormatUtils.formatCode(event.description);
      const eventTitle = FormatUtils.formatTitle(event.title);

      // Create Bill if not yet in database
      const billExists = await this.doesOneExist({ code });
      if (!billExists) {
        const bill = await createBill(event);
        const { id } = await this.createBill(bill);
        createdBillIds.push(id);
      }

      // Add event to Bill document if not yet added
      const eventExists = await this.doesOneExist({
        $and: [{ code }, { "events.title": eventTitle }],
      });
      if (!eventExists) {
        await this.addBillEvent(code, new BillEvent(event));
      }

      // Update bill passed/failed status if applicable
      const billExistsToUpdatePassed = await this.doesOneExist({ code });
      if (billExistsToUpdatePassed) {
        if (this.billHasPassed(eventTitle)) {
          await this.updateBillPassed({
            code,
            pageUrl: event.link,
            passed: true,
          });
        } else if (this.billHasFailed(eventTitle)) {
          await this.updateBillPassed({ code, passed: false });
        }
      }
    }

    // Add all new bills to their respective parliamentary sessions
    await this.addBillsToParliamentarySession(
      createdBillIds,
      parliamentarySessionId,
    );
  }

  billHasPassed = (eventTitle: string): boolean =>
    eventTitle.includes("Royal Assent");

  billHasFailed = (eventTitle: string): boolean =>
    Boolean(
      eventTitle.includes("Defeated") ||
        eventTitle.includes("Not Proceeded With"),
    );

  private async addBillsToParliamentarySession(
    billIds: string[],
    parliamentarySessionId: string,
  ): Promise<void> {
    const service = new ParliamentsService();
    const query = { "parliamentarySessions.id": parliamentarySessionId };

    const { parliamentarySessions } = await service.findOne(query);
    const { bills } = parliamentarySessions[parliamentarySessions.length - 1];

    for await (const billId of billIds) {
      const billExists = bills.some((id) => id === billId);
      if (!billExists) {
        await service.updatePushArray(
          query,
          "parliamentarySessions.$[element].bills",
          { "element._id": parliamentarySessionId },
          billId,
        );
      }
    }
  }

  private sortBillEventsByDate(billEventsArray: PBillEvent[]): PBillEvent[] {
    return billEventsArray.sort((a, b) =>
      !!(!!a.pubDate && !!b.pubDate) && a.pubDate < b.pubDate ? 1 : -1,
    );
  }

  async updateSummaryUrls(billSummaryMaps: IBillSummaryMap[]): Promise<number> {
    let billsUpdated = 0;

    const billCodes = billSummaryMaps.map(({ code }) => code);
    const billsWithNoSummary = await this.findMany({
      $and: [{ code: { $in: billCodes } }, { summaryUrl: null }],
    });

    for await (const { code, url: summaryUrl } of billSummaryMaps) {
      const billToUpdate = billsWithNoSummary?.find(
        (bill) => bill.code === code,
      );
      if (billToUpdate) {
        await this.updateOne({ _id: billToUpdate.id }, { summaryUrl });
        billsUpdated++;
      }
    }

    return billsUpdated;
  }

  async addBillEvent(code: string, event: BillEvent): Promise<Bill> {
    return this.updatePush({ code }, { events: event });
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
