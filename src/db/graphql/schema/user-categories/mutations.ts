import { GraphQLInt, GraphQLNonNull } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { db } from "@db";
import { UserCategoryType } from "./type";

export const userCategoryMutations: GraphQLFields = {
  addUserCategory: {
    type: UserCategoryType,
    args: {
      user_id: { type: GraphQLNonNull(GraphQLInt) },
      category_id: { type: GraphQLNonNull(GraphQLInt) },
      created_at: { type: GraphQLDateTime },
    },
    resolve: async (_parent, args, _context, _resolveInfo) => {
      try {
        const query = `INSERT INTO user_categories (user_id, category_id, created_at) 
          VALUES ($1, $2, (to_timestamp(${Date.now()} / 1000.0))) 
          RETURNING *`;
        const values = [args.user_id, args.category_id];

        const response = await db.one(query, values);

        console.log("Successfully added user category.");
        return response[0];
      } catch (err) {
        console.error(`Failed to insert new user category. ${err}`);
        throw new Error(`Failed to insert new user category. ${err}`);
      }
    },
  },

  removeUserCategory: {
    type: UserCategoryType,
    args: {
      user_id: { type: GraphQLNonNull(GraphQLInt) },
      category_id: { type: GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (_parent, args, _context, _resolveInfo) => {
      try {
        const query = `DELETE FROM user_bills 
          WHERE (user_id = $1) AND (category_id = $2)`;
        const values = [args.user_id, args.category_id];

        const response = await db.one(query, values);

        console.log("Successfully deleted user category.");
        return response[0];
      } catch (err) {
        console.error(`Failed to delete user bill. ${err}`);
        throw new Error(`Failed to delete user bill. ${err}`);
      }
    },
  },
};
