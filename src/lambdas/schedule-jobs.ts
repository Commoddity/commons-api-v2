import { initClient } from "../db";
import { BillsService } from "../services/bills/service";
import { EEntityTypes, EEventTypes, ICloudWatchEvent } from "../types";

let initialize = null;

exports.handler = async ({
  header: {
    eventType: { entityType, type },
  },
}: ICloudWatchEvent) => {
  if (!initialize) {
    initialize = await initClient();
  }

  let consumer: () => Promise<void>;

  if (entityType === EEntityTypes.Bills) {
    if (type === EEventTypes.UpdateBills) {
      consumer = async () => await new BillsService().updateBillsForCurrentSession();
    }
  }

  return consumer?.() || null;
};
