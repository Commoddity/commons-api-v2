import joinMonster from "join-monster";
import sqlString from "sqlstring";
import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} from "graphql";

import { db } from "@config";

import { UserType } from "./types";
import { NotificationEnumType } from "../../enums";

const userQueries: GraphQLFields = {
  users: {
    type: new GraphQLList(UserType),
    args: {
      id: { type: GraphQLInt },
      first_name: { type: GraphQLString },
      last_name: { type: GraphQLString },
      username: { type: GraphQLString },
      email: { type: GraphQLString },
      phone_number: { type: GraphQLInt },
      email_notification: { type: NotificationEnumType },
      sms_notification: { type: NotificationEnumType },
      active: { type: GraphQLBoolean },
    },
    where: (usersTable, args, _context, _resolveInfo) => {
      const whereClause: string[] = [];
      const values: any[] = [];

      Object.entries(args).forEach(([arg, value]) => {
        whereClause.push(`${usersTable}.${arg} = ?`);
        values.push(value);
      });

      const escapedString = sqlString.format(whereClause.join(" AND "), values);
      return escapedString;
    },
    resolve: (_parent, _args, _context, resolveInfo) => {
      return joinMonster(resolveInfo, {}, (sql: string) => {
        return db.query(sql);
      });
    },
  },

  user: {
    type: UserType,
    args: {
      id: { type: GraphQLInt },
      first_name: { type: GraphQLString },
      last_name: { type: GraphQLString },
      username: { type: GraphQLString },
      email: { type: GraphQLString },
      phone_number: { type: GraphQLInt },
      email_notification: { type: NotificationEnumType },
      sms_notification: { type: NotificationEnumType },
      active: { type: GraphQLBoolean },
    },
    where: (userTable, args, _context, _resolveInfo) => {
      const whereClause: string[] = [];
      const values: any[] = [];

      Object.entries(args).forEach(([arg, value]) => {
        whereClause.push(`${userTable}.${arg} = ?`);
        values.push(value);
      });

      const escapedString = sqlString.format(whereClause.join(" AND "), values);
      return escapedString;
    },
    resolve: (_parent, _args, _context, resolveInfo) => {
      return joinMonster(resolveInfo, {}, (sql: string) => {
        return db.query(sql);
      });
    },
  },
};

export { userQueries };
