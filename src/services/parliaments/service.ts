import { BaseService } from "@services";

import { Parliament, IParliamentarySession } from "./model";
import { Collection as ParliamentCollection } from "./collection";

export class ParliamentsService extends BaseService<Parliament> {
  constructor() {
    super(ParliamentCollection, Parliament);
  }

  async createParliament(parliament: Parliament): Promise<Parliament> {
    return super.createOne(parliament);
  }

  async createParliamentarySession(
    parliamentarySession: IParliamentarySession,
  ): Promise<Parliament> {
    const { id } = await super.findOne(
      {},
      { limit: 1, sort: { createdAt: -1 } },
    );

    return super.updatePush(
      { _id: id },
      { parliamentarySessions: parliamentarySession },
    );
  }

  async addBillsToParliamentarySession(
    parliamentarySession: IParliamentarySession,
  ): Promise<Parliament> {
    const { id } = await super.findOne(
      {},
      { limit: 1, sort: { createdAt: -1 } },
    );

    return super.updatePush(
      { _id: id },
      { parliamentarySessions: parliamentarySession },
    );
  }

  async queryLatestParliamentarySession(): Promise<string> {
    const { parliamentarySessions } = await super.findOne(
      {},
      { limit: 1, sort: { createdAt: -1 } },
    );

    const { id: latestParliamentarySessionId } =
      parliamentarySessions[parliamentarySessions.length - 1];
    return latestParliamentarySessionId;
  }
}
