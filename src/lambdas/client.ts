import { initClient } from "../db";
import { BillsService, ParliamentsService, UsersService } from "../services";
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
    const { arguments: params, field, identity } = event;

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

      getOneUser: () => {
        const userId = identity.claims["custom:userId"];
        return new UsersService().getOneUser(userId);
      },

      /* Update */
      addUserBill: () => {
        const { userId, billCode } = params;
        return new UsersService().addUserBill(userId, billCode);
      },

      removeUserBill: () => {
        const { userId, billCode } = params;
        return new UsersService().removeUserBill(userId, billCode);
      },

      addUserCategory: () => {
        const { userId, category } = params;
        return new UsersService().addUserCategory(userId, category);
      },

      removeUserCategory: () => {
        const { userId, category } = params;
        return new UsersService().removeUserCategory(userId, category);
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

  return resolver?.() || null;
};
