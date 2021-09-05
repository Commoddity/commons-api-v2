import { BaseService, BillsService } from "@services";

import { BillEvent } from "./model";
import { Bill } from "../bills";
import { Collection as BillEventCollection } from "./collection";

export class EventsService extends BaseService<BillEvent> {
  constructor() {
    super(BillEventCollection, BillEvent);
  }

  async createEvent(event: BillEvent): Promise<BillEvent> {
    return super.createOne(event);
  }

  async createManyEvents(events: BillEvent[]): Promise<BillEvent[]> {
    return super.createMany(events);
  }

  async updateBillsPassedStatus(events: BillEvent[]): Promise<Bill[]> {
    const billsUpdated: Bill[] = [];

    for await (const event of events) {
      const billHasPassed = !!event.title.includes("Royal Assent");
      const billHasFailed = !!(
        event.title.includes("Defeated") ||
        event.title.includes("Not Proceeded With")
      );

      if (billHasPassed) {
        const updatedBill = await new BillsService().updateBillPassed({
          code: event.bill_code,
          passed: true,
        });

        console.log(
          `Bill ${event.bill_code} has passed and the DB has been updated ....`,
        );

        billsUpdated.push(updatedBill);
      } else if (billHasFailed) {
        const updatedBill = await new BillsService().updateBillPassed({
          code: event.bill_code,
          passed: false,
        });

        console.log(
          `Bill ${event.bill_code} has failed and the DB has been updated ....`,
        );

        billsUpdated.push(updatedBill);
      }
    }

    return billsUpdated;
  }

  async deleteEvent(bill_code: string): Promise<void> {
    return super.deleteOne({ bill_code });
  }
}
