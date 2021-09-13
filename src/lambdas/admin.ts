import { initClient } from "../db";
import { BillsService, ParliamentsService } from "../services";
import { IBill } from "../services/bills/model";
import { IParliamentarySession } from "../services/parliaments/model";
import { IUser } from "../services/users/model";
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

      /* Update */
      updateBillCategories: () => {
        const { code, categories } = params;
        return new BillsService().updateBillCategories(code, categories);
      },
    }[field];
  } else {
    const [{ field }] = event;

    resolver = {
      /* Field Level Resolvers*/
      getBillsField: async () => {
        const events = event as IAppSyncResolverEvent<
          any,
          IParliamentarySession | IUser
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

      getSessionCodeField: async () => {
        const events = event as IAppSyncResolverEvent<any, IBill>[];
        const sessionCodesArray = [];

        for await (const { source: bill } of events) {
          const { parliamentarySessionId: sessionId } = bill;
          const sessionCode = await new ParliamentsService().getSessionCode(
            sessionId,
          );

          sessionCodesArray.push(sessionCode || null);
        }

        return sessionCodesArray;
      },
    }[field];
  }

  return resolver?.() || null;
};
