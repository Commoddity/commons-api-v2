import { GraphQLInt, GraphQLNonNull } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { db } from "@db";
import { UserBill } from "./type";

export const userBillMutations: GraphQLFields = {
  addUserBill: {
    type: UserBill,
    args: {
      user_id: { type: GraphQLNonNull(GraphQLInt) },
      bill_id: { type: GraphQLNonNull(GraphQLInt) },
      created_at: { type: GraphQLDateTime },
    },
    resolve: async (_parent, args, _context, _resolveInfo) => {
      try {
        const query = `INSERT INTO user_bills (user_id, bill_id, created_at) 
          VALUES ($1, $2, (to_timestamp(${Date.now()} / 1000.0))) 
          RETURNING *`;
        const values = [args.user_id, args.bill_id];

        await db.none(query, values);
        console.log("Successfully added user bill.");
        return true;
      } catch (err) {
        throw new Error(`Failed to insert new user bill. ${err}`);
      }
    },
  },

  deleteUserBill: {
    type: UserBill,
    args: {
      user_id: { type: GraphQLInt },
      bill_id: { type: GraphQLInt },
    },
    resolve: async (_parent, args, _context, _resolveInfo) => {
      try {
        const query = `DELETE FROM user_bills 
          WHERE (user_id = $1) AND (bill_id = $2)`;
        const values = [args.user_id, args.bill_id];

        await db.none(query, values);
        console.log("Successfully deleted user bill.");
        return true;
      } catch (err) {
        throw new Error(`Failed to delete user bill. ${err}`);
      }
    },
  },
};
