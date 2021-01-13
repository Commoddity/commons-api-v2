import { GraphQLInt, GraphQLNonNull } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { UserBill } from "./type";

import { UsersService } from "@services";

export const userBillMutations: GraphQLFields = {
  addUserBill: {
    type: UserBill,
    args: {
      user_id: { type: GraphQLNonNull(GraphQLInt) },
      bill_id: { type: GraphQLNonNull(GraphQLInt) },
      created_at: { type: GraphQLDateTime },
    },
    resolve: (_parent, args, _context, _resolveInfo) =>
      new UsersService().gqlCreateUserBill({
        userId: args.userId,
        billId: args.bill_id,
      }),
  },

  deleteUserBill: {
    type: UserBill,
    args: {
      user_id: { type: GraphQLInt },
      bill_id: { type: GraphQLInt },
    },
    resolve: async (_parent, args, _context, _resolveInfo) =>
      new UsersService().gqlDeleteUserBill({
        userId: args.userId,
        billId: args.bill_id,
      }),
  },
};
