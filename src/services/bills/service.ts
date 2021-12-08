import { FilterQuery } from "mongoose";

import { BaseService, WebService } from "../../services";
import { EBillCategories, IBill, IBillAddedFields, PBillFetch } from "../../types";

import { BillInput } from "./model";
import { Collection as BillCollection } from "./collection";

enum LEGISInfoURLs {
  BASE_URL = "https://www.parl.ca/legisinfo/en/bills/json",
  BASE_URL_ONE_BILL = "https://www.parl.ca/LegisInfo/en/bill",
}

export class BillsService extends BaseService<IBillAddedFields> {
  constructor() {
    super(BillCollection);
  }

  async createBill(bill: IBillAddedFields): Promise<IBillAddedFields> {
    return super.createOne(bill);
  }

  async createManyBills({ parliament, session }: PBillFetch): Promise<IBillAddedFields[]> {
    const bills = await this.getAllBillsForSession(parliament, session);
    const billInputs = bills.map((bill) => new BillInput(bill));
    return super.createMany(billInputs);
  }

  async getOneBill({ parliament, session, code }: PBillFetch): Promise<IBill> {
    const billEndpoint = `${LEGISInfoURLs.BASE_URL_ONE_BILL}/${parliament}-${session}/${code}/json`;
    try {
      const [bill] = await new WebService().fetchJSON(billEndpoint);

      if (bill) {
        return bill;
      } else {
        throw `Bill ${code} not found for parliamentary session ${parliament}-${session}.`;
      }
    } catch (error) {
      throw new Error(`BillsService#getOneBill: ${error}`);
    }
  }

  async getAllBillsForSession(parliament: number, session: number): Promise<IBill[]> {
    try {
      return await new WebService().fetchJSON(
        `${LEGISInfoURLs.BASE_URL}?parlsession=${parliament}-${session}`,
      );
    } catch (error) {
      throw new Error(`BillsService#getAllBillsForSession: ${error}`);
    }
  }

  async getBillAddedFields(
    parliamentarySession: string,
    billCodes: string[],
  ): Promise<IBillAddedFields[]> {
    try {
      return this.findMany({
        parliamentarySession,
        code: { $in: billCodes },
      });
    } catch (error) {
      throw new Error(`BillsService#getOneBillAddedFields: ${error}`);
    }
  }

  async updateBillsForCurrentSession(): Promise<void> {
    const { parliament, session } = await new WebService().getCurrentSession();
    const parliamentarySession = `${parliament}-${session}`;

    const bills = await this.getAllBillsForSession(parliament, session);
    const savedBills = await this.findMany({ parliamentarySession });

    console.log(`Initializing daily Bills update for session ${parliamentarySession} ...`);
    let updated: 0;
    let created: 0;
    for await (const bill of bills) {
      const savedBill = savedBills?.find(
        ({ code, parliamentarySession: savedSession }) =>
          parliamentarySession === savedSession && code === bill.NumberCode,
      );

      if (savedBill) {
        const { fullTextUrl } = new BillInput(bill);
        if (fullTextUrl !== savedBill.fullTextUrl) {
          const { code } = savedBill;
          await super.updateOne({ parliamentarySession, code }, { fullTextUrl });
          console.log(`Bill ${code} updated with new fullTextUrl ...`);
          updated++;
        }
      } else {
        const { code } = await super.createOne(new BillInput(bill));
        console.log(`New Bill ${code} created ...`);
        created++;
      }
    }
    console.log(
      `Daily Bills update for session ${parliamentarySession} completed. ${updated} Bills Updated, ${created} new Bills created.`,
    );
  }

  async updateBillCategories(
    { parliament, session, code }: PBillFetch,
    categories: EBillCategories[],
  ): Promise<IBillAddedFields> {
    const parliamentarySession = `${parliament}-${session}`;
    return this.updateOne({ parliamentarySession, code }, { categories });
  }

  async deleteBill(query: FilterQuery<IBillAddedFields>): Promise<void> {
    return super.deleteOne(query);
  }

  /* Media Sources methods */
  async addMediaSourceToBill(
    { parliament, session, code }: PBillFetch,
    url: string,
  ): Promise<IBillAddedFields> {
    const parliamentarySession = `${parliament}-${session}`;
    try {
      if (await super.doesOneExist({ parliamentarySession, code, "mediaSources.url": url })) {
        throw new Error(`Media source already exists for IBill ${code}.`);
      }

      const webService = new WebService();
      const mediaSourceData = await webService.getMediaSourceData(url);

      return this.updatePush({ parliamentarySession, code }, { mediaSources: mediaSourceData });
    } catch (error) {
      throw new Error(`[ADD MEDIA SOURCE TO BILL]: ${error}`);
    }
  }
}
