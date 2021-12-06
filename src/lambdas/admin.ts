import { initClient } from "../db";
import { BillsService } from "../services";
import { IAppSyncResolverEvent, IBill } from "../types";

let initialize = null;

exports.handler = async (event: IAppSyncResolverEvent | IAppSyncResolverEvent[]) => {
  if (!initialize) {
    initialize = await initClient();
  }

  let resolver: () => any;

  if (!Array.isArray(event)) {
    const { arguments: params, field } = event;

    resolver = {
      /* Read */
      getAllBillsForSession: () => {
        const { parliament, session } = params;
        return new BillsService().getAllBillsForSession(parliament, session);
      },

      getOneBill: () => {
        const { parliament, session, code } = params;
        return new BillsService().getOneBill({ parliament, session, code });
      },

      /* Update */
      updateBillCategories: () => {
        const { parliament, session, code, categories } = params;
        return new BillsService().updateBillCategories({ parliament, session, code }, categories);
      },

      addMediaSourceToBill: () => {
        const { parliament, session, code, url } = params;
        return new BillsService().addMediaSourceToBill({ parliament, session, code }, url);
      },
    }[field];
  } else {
    const [{ field }] = event;

    resolver = {
      /* Field Level Resolvers*/
      getBillAddedFields: async () => {
        const events = event as IAppSyncResolverEvent<any, IBill>[];
        const {
          source: { ParliamentNumber, SessionNumber },
        } = events[0];
        const parliamentarySession = `${ParliamentNumber}-${SessionNumber}`;
        const billCodes = events.map(({ source: { NumberCode } }) => NumberCode);

        const recordsMap = {};
        (await new BillsService().getBillAddedFields(parliamentarySession, billCodes)).forEach(
          (bill) => (recordsMap[bill.code] = bill),
        );

        return events.map(({ source: { NumberCode } }) => recordsMap[NumberCode]);
      },
    }[field];
  }

  return resolver?.() || null;
};
