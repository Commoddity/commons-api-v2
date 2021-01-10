import { BaseService } from "../base-service";
import { BillsService } from "../bills";

import { Event } from "./model";

export class EventsService extends BaseService<Event> {
  private table = "events";

  async createEvent(event: Event): Promise<Event> {
    return await super.createOne({ table: this.table, tableValues: event });
  }

  async createManyEvents(events: Event[]): Promise<Event[]> {
    return await super.createMany({
      table: this.table,
      tableValuesArray: events,
    });
  }

  async updateBillsPassedStatus(events: Event[]): Promise<boolean> {
    let billsUpdated = false;

    for await (const event of events) {
      const billHasPassed = !!event.title.includes("Royal Assent");
      const billHasFailed = !!(
        event.title.includes("Defeated") ||
        event.title.includes("Not Proceeded With")
      );

      if (billHasPassed) {
        await new BillsService().updateBillPassed({
          code: event.bill_code,
          passed: true,
        });
        billsUpdated = true;
      } else if (billHasFailed) {
        await new BillsService().updateBillPassed({
          code: event.bill_code,
          passed: false,
        });
        billsUpdated = true;
      }
    }

    return billsUpdated;
  }

  async deleteEvent(bill_code: string): Promise<boolean> {
    return await super.deleteOne({ table: this.table, where: { bill_code } });
  }
}
