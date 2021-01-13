import { BaseService } from "../base-service";
import { Parliament } from "./model";

export class ParliamentsService extends BaseService<Parliament> {
  async queryLatestParliamentarySession(): Promise<number> {
    return await super.findLatestId({ table: `parliamentary_sessions` });
  }
}
