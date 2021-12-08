import { initClient } from "../db";
import { BillsService, UsersService, WebService } from "../services";
import { IAppSyncResolverEvent, IBill } from "../types";

let initialize = null;

exports.handler = async (event: IAppSyncResolverEvent | IAppSyncResolverEvent[]) => {
  if (!initialize) {
    initialize = await initClient();
  }

  let resolver: () => any;

  if (!Array.isArray(event)) {
    const { arguments: params, field, identity } = event;

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

      getOneUser: () => {
        const userId = identity.claims["custom:userId"];
        return new UsersService().getOneUser(userId);
      },

      fetchMpInfo: () => {
        const { query } = params;
        return new WebService().fetchMpInfo(query);
      },

      /* Update */
      addUserBill: () => {
        const userId = identity.claims["custom:userId"];
        const { billCode } = params;
        return new UsersService().addUserBill(userId, billCode);
      },

      removeUserBill: () => {
        const userId = identity.claims["custom:userId"];
        const { billCode } = params;
        return new UsersService().removeUserBill(userId, billCode);
      },

      addUserCategory: () => {
        const userId = identity.claims["custom:userId"];
        const { category } = params;
        return new UsersService().addUserCategory(userId, category);
      },

      removeUserCategory: () => {
        const userId = identity.claims["custom:userId"];
        const { category } = params;
        return new UsersService().removeUserCategory(userId, category);
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

        return events.map(({ source: { NumberCode } }) => recordsMap[NumberCode] || {});
      },
    }[field];
  }

  return resolver?.() || null;
};
