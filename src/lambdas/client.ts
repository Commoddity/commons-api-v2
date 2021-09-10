import { initClient } from "../db";
import { BillsService, ParliamentsService } from "../services";
import { IParliamentarySession } from "../services/parliaments/model";
import { IAppSyncResolverEvent } from "../types";

let initialize = null;

exports.handler = async (
  event: IAppSyncResolverEvent | IAppSyncResolverEvent[],
) => {
  if (!initialize) {
    initialize = await initClient();
  }

  let resolver: () => any;

  if (!Array.isArray(event)) {
    const { arguments: params, field } = event;
    resolver = {
      /* Read */
      getAllBills: () => {
        return new BillsService().findAll();
      },

      getOneBill: () => {
        const { code } = params;
        return new BillsService().findOne({ code });
      },

      getAllParliaments: () => {
        return new ParliamentsService().findAll();
      },
    }[field];
  } else {
    const [{ field }] = event;

    resolver = {
      /* Field Level Resolvers*/
      getBillsField: async () => {
        const events = event as IAppSyncResolverEvent<
          any,
          IParliamentarySession
        >[];
        const billsArray = [];

        for await (const { source: session } of events) {
          const { bills: billIds } = session;
          const bills = await new BillsService().findMany({
            _id: { $in: billIds },
          });
          billsArray.push(bills?.length ? bills : null);
        }

        return billsArray;
      },
    }[field];
  }

  return resolver ? resolver() : null;
};
