import { BaseService } from "../base-service";
import { Bill } from "./model";

export class ParliamentsService extends BaseService<Bill> {
  async queryLatestParliamentarySession(): Promise<string | undefined> {
    return await super.findLatestId({ table: `parliamentary_sessions` });
  }
}
