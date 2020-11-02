import joinMonster from "join-monster";
import sqlString from "sqlstring";
import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} from "graphql";

import { db } from "@config";
import { GraphQLFields } from "@types";

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
    where: (usersTable: string, args: { [key: string]: any }) => {
      const whereClause = [];
      const values = [];
      if (args.id) {
        whereClause.push(`${usersTable}.id = ?`);
        values.push(args.id);
      }
      if (args.first_name) {
        whereClause.push(`${usersTable}.first_name = ?`);
        values.push(args.first_name);
      }
      if (args.last_name) {
        whereClause.push(`${usersTable}.last_name = ?`);
        values.push(args.last_name);
      }
      if (args.username) {
        whereClause.push(`${usersTable}.username = ?`);
        values.push(args.username);
      }
      if (args.email) {
        whereClause.push(`${usersTable}.email = ?`);
        values.push(args.email);
      }
      if (args.phone_number) {
        whereClause.push(`${usersTable}.phone_number = ?`);
        values.push(args.phone_number);
      }
      if (args.email_notification) {
        whereClause.push(`${usersTable}.email_notification = ?`);
        values.push(args.email_notification);
      }
      if (args.sms_notification) {
        whereClause.push(`${usersTable}.sms_notification = ?`);
        values.push(args.sms_notification);
      }
      if (args.active) {
        whereClause.push(`${usersTable}.active = ?`);
        values.push(args.active);
      }
      const escapedString = sqlString.format(whereClause.join(" AND "), values);
      return escapedString;
    },
    resolve: (
      _parent: any,
      _args: { [key: string]: any },
      _context: any,
      resolveInfo: any,
    ) => {
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
    where: (userTable: string, args: { [key: string]: any }) => {
      const whereClause = [];
      const values = [];
      if (args.id) {
        whereClause.push(`${userTable}.id = ?`);
        values.push(args.id);
      }
      if (args.first_name) {
        whereClause.push(`${userTable}.first_name = ?`);
        values.push(args.first_name);
      }
      if (args.last_name) {
        whereClause.push(`${userTable}.last_name = ?`);
        values.push(args.last_name);
      }
      if (args.username) {
        whereClause.push(`${userTable}.username = ?`);
        values.push(args.username);
      }
      if (args.email) {
        whereClause.push(`${userTable}.email = ?`);
        values.push(args.email);
      }
      if (args.postal_code) {
        whereClause.push(`${userTable}.postal_code = ?`);
        values.push(args.postal_code);
      }
      if (args.phone_number) {
        whereClause.push(`${userTable}.phone_number = ?`);
        values.push(args.phone_number);
      }
      if (args.email_notification) {
        whereClause.push(`${userTable}.email_notification = ?`);
        values.push(args.email_notification);
      }
      if (args.sms_notification) {
        whereClause.push(`${userTable}.sms_notification = ?`);
        values.push(args.sms_notification);
      }
      if (args.active) {
        whereClause.push(`${userTable}.active = ?`);
        values.push(args.active);
      }
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
