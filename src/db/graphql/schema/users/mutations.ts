import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { User } from "./type";

import { UsersService, User as UserClass } from "@services";

export const userMutations: GraphQLFields = {
  addUser: {
    type: User,
    args: {
      first_name: { type: GraphQLNonNull(GraphQLString) },
      last_name: { type: GraphQLNonNull(GraphQLString) },
      username: { type: GraphQLNonNull(GraphQLString) },
      email: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_parent, args, _context, _resolveInfo) =>
      new UsersService().createUser(args as UserClass),
  },

  deleteUser: {
    type: User,
    args: {
      id: { type: GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (_parent, args, _context, _resolveInfo) =>
      new UsersService().deleteUser(args.id),
  },
};
