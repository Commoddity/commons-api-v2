import { BaseService } from "../../services";

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
    parliamentId: string,
    parliamentarySession: IParliamentarySession,
  ): Promise<Parliament> {
    return super.updatePush(
      { _id: parliamentId },
      { parliamentarySessions: parliamentarySession },
    );
  }

  async queryLatestSession(): Promise<string> {
    const { parliamentarySessions: sessions } = await super.findOne(
      {},
      { limit: 1, sort: { number: -1 } },
    );

    const { sessionId } = sessions.reduce((a, b) =>
      a.number > b.number ? a : b,
    );
    return sessionId;
  }
}
