import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} from "graphql";
import joinMonster from "join-monster";
import { User } from "./type";
import { NotificationEnumType } from "../../enums";

import { UsersService, QueryUtils } from "@services";

export const userQueries: GraphQLFields = {
  users: {
    type: new GraphQLList(User),
    args: {
      id: { type: GraphQLInt },
      first_name: { type: GraphQLString },
      last_name: { type: GraphQLString },
      email: { type: GraphQLString },
      phone_number: { type: GraphQLInt },
      email_notification: { type: NotificationEnumType },
      sms_notification: { type: NotificationEnumType },
      active: { type: GraphQLBoolean },
    },
    extensions: {
      joinMonster: {
        where: (usersTable, args, _context) =>
          QueryUtils.createGraphQLWhereClause(usersTable, args),
      },
    },
    resolve: (_parent, _args, _context, resolveInfo) =>
      joinMonster(resolveInfo, {}, (sql: string) =>
        new UsersService().gqlFindManyUsers(sql),
      ),
  },

  user: {
    type: User,
    args: {
      id: { type: GraphQLInt },
      first_name: { type: GraphQLString },
      last_name: { type: GraphQLString },
      email: { type: GraphQLString },
      phone_number: { type: GraphQLInt },
      email_notification: { type: NotificationEnumType },
      sms_notification: { type: NotificationEnumType },
      active: { type: GraphQLBoolean },
    },
    extensions: {
      joinMonster: {
        where: (userTable, args, _context) =>
          QueryUtils.createGraphQLWhereClause(userTable, args),
      },
    },
    resolve: (_parent, _args, _context, resolveInfo) =>
      joinMonster(resolveInfo, {}, (sql: string) =>
        new UsersService().gqlFindOneUser(sql),
      ),
  },
};
