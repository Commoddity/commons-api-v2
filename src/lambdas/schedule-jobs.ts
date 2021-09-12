import { initClient } from "../db";
import { WebService } from "../services/web/service";
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
      consumer = async () => await new WebService().updateBills();
    }
  }

  return consumer?.() || null;
};
