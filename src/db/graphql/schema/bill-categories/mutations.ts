import { GraphQLInt, GraphQLNonNull } from "graphql";

import { db } from "@config";
import { GraphQLFields } from "@types";

import { BillCategoryType } from "./types";

const billCategoryMutations: GraphQLFields = {
  addBillCategory: {
    type: BillCategoryType,
    args: {
      bill_id: { type: GraphQLNonNull(GraphQLInt) },
      category_id: { type: GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (_parent, args, _context, _resolveInfo) => {
      try {
        const query = `INSERT INTO bill_categories (bill_id, category_id, created_at) 
          VALUES ($1, $2, (to_timestamp(${Date.now()} / 1000.0))) 
          RETURNING *`;
        const values = [args.bill_id, args.category_id];
        const response = await db.query(query, values);
        console.log("Successfully added bill category.");
        return response[0];
      } catch (err) {
        console.error(`Failed to insert new bill category. ${err}`);
        throw new Error(`Failed to insert new bill category. ${err}`);
      }
    },
  },

  removeBillCategory: {
    type: BillCategoryType,
    args: {
      bill_id: { type: GraphQLNonNull(GraphQLInt) },
      category_id: { type: GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (_parent, args, _context, _resolveInfo) => {
      try {
        const query = `DELETE FROM bill_categories 
          WHERE (bill_id = $1) AND (category_id = $2)`;
        const values = [args.bill_id, args.category_id];
        const response = await db.query(query, values);
        console.log("Successfully deleted bill category.");
        return response[0];
      } catch (err) {
        console.error(`Failed to delete bill category. ${err}`);
        throw new Error(`Failed to delete bill category. ${err}`);
      }
    },
  },
};

export { billCategoryMutations };
