import { BaseService } from "@services";
import {
  ParliamentInterface as Parliament,
  ParliamentarySessionInterface as ParliamentarySession,
} from "./model";

export class ParliamentsService extends BaseService<Parliament> {
  async queryLatestParliamentarySession(): Promise<number> {
    return await super.findLatestId({ table: `parliamentary_sessions` });
  }

  // GraphQL methods
  async gqlFindOneParliament(query: string): Promise<Parliament> {
    return super.one<Parliament>(query);
  }

  async gqlFindManyParliaments(query: string): Promise<Parliament[]> {
    return super.many<Parliament>(query);
  }

  async gqlFindOneParliamentarySession(
    query: string,
  ): Promise<ParliamentarySession> {
    return super.one<ParliamentarySession>(query);
  }

  async gqlFindManyParliamentarySessions(
    query: string,
  ): Promise<ParliamentarySession[]> {
    return super.many<ParliamentarySession>(query);
  }
}
