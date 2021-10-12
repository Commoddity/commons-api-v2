import { FilterQuery, UpdateQuery } from "mongoose";

import { BaseService, ParliamentsService, WebService } from "../../services";
import { EBillCategories, IBillSummaryMap, PBillEvent } from "../../types";
import { FormatUtils } from "../../utils";

import {
  Bill,
  BillEvent,
  BillInput,
  createBill,
  IBillMediaSource,
} from "./model";
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

  async deleteBill(query: FilterQuery<Bill>): Promise<void> {
    return super.deleteOne(query);
  }

  async updateBillPassed({
    code,
    pageUrl,
    passed,
  }: UpdateQuery<Bill>): Promise<Bill> {
    let update: UpdateQuery<Bill> = { passed };
    if (passed) {
      update = {
        ...update,
        passedDate: new Date(await BillInput.getPassedDate(pageUrl)),
      };
    }
    return super.updateOne({ code }, update);
  }

  async updateBillsAndEvents(billEventsArray: PBillEvent[]): Promise<void> {
    const parlService = new ParliamentsService();
    const sessionId = await parlService.queryLatestSession();

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
    await this.addBillsToParliamentarySession(createdBillIds, sessionId);
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
    sessionId: string,
  ): Promise<void> {
    const parlService = new ParliamentsService();
    const query = { "parliamentarySessions.id": sessionId };

    const { parliamentarySessions: sessions } = await parlService.findOne(
      query,
    );
    const { bills } = sessions[sessions.length - 1];

    for await (const billId of billIds) {
      const billExists = bills.some((id) => id === billId);
      if (!billExists) {
        await parlService.updatePushArray(
          query,
          "parliamentarySessions.$[element].bills",
          { "element.sessionId": sessionId },
          billId,
        );
      }
    }
  }

  private sortBillEventsByDate(billEventsArray: PBillEvent[]): PBillEvent[] {
    return billEventsArray.sort((a, b) =>
      Boolean(a.pubDate && b.pubDate) && a.pubDate < b.pubDate ? 1 : -1,
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

  async updateBillCategories(
    code: string,
    categories: EBillCategories[],
  ): Promise<Bill> {
    return this.updateOne({ code }, { categories });
  }

  /* Media Sources methods */
  async addMediaSourceToBill(code: string, url: string): Promise<Bill> {
    try {
      if (await super.doesOneExist({ code, "mediaSources.url": url })) {
        throw new Error(`Media source already exists for Bill ${code}.`);
      }

      const webService = new WebService();
      const mediaSourceData = await webService.getMediaSourceData(url);

      return this.updatePush({ code }, { mediaSources: mediaSourceData });
    } catch (error) {
      throw new Error(`[ADD MEDIA SOURCE TO BILL]: ${error}`);
    }
  }
}
