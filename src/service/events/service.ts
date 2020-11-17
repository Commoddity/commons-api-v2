import { BaseService } from "../base-service";

import { Event } from "./model";

export class EventsService extends BaseService<Event> {
  private table = "events";

  async createEvent(event: Event): Promise<Event | undefined> {
    return await super.createOne({ table: this.table, tableValues: event });
  }

  async createManyEvents(events: Event[]): Promise<Event[] | undefined> {
    return await super.createMany({
      table: this.table,
      tableValuesArray: events,
    });
  }
}
