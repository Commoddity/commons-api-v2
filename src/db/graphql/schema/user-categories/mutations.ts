import { GraphQLInt, GraphQLNonNull } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { UserCategoryType } from "./type";

import { UsersService } from "@services";

export const userCategoryMutations: GraphQLFields = {
  addUserCategory: {
    type: UserCategoryType,
    args: {
      user_id: { type: GraphQLNonNull(GraphQLInt) },
      category_id: { type: GraphQLNonNull(GraphQLInt) },
      created_at: { type: GraphQLDateTime },
    },
    resolve: async (_parent, args, _context, _resolveInfo) =>
      new UsersService().gqlCreateUserCategory({
        userId: args.userId,
        categoryId: args.category_id,
      }),
  },

  removeUserCategory: {
    type: UserCategoryType,
    args: {
      user_id: { type: GraphQLNonNull(GraphQLInt) },
      category_id: { type: GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (_parent, args, _context, _resolveInfo) =>
      new UsersService().gqlDeleteUserCategory({
        userId: args.userId,
        categoryId: args.category_id,
      }),
  },
};
