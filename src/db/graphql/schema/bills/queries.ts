import joinMonster from "join-monster";
import sqlString from "sqlstring";
import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from "graphql";

import { db } from "@config";
import { GraphQLFields } from "@types";

import { DateScalar } from "../../scalars";
import { BillType } from "./types";

const billQueries: GraphQLFields = {
  bills: {
    type: new GraphQLList(BillType),
    args: {
      id: { type: GraphQLInt },
      parliamentary_session_id: { type: GraphQLInt },
      code: { type: GraphQLString },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      introduced_date: { type: DateScalar },
      passed: { type: GraphQLBoolean },
    },
    where: (billsTable, args, _context, _resolveInfo) => {
      const whereClause = [];
      const values = [];
      if (args.id) {
        whereClause.push(`${billsTable}.id = ?`);
        values.push(args.id);
      }
      if (args.parliamentary_session_id) {
        whereClause.push(`${billsTable}.parliamentary_session_id = ?`);
        values.push(args.parliamentary_session_id);
      }
      if (args.code) {
        whereClause.push(`${billsTable}.code = ?`);
        values.push(args.code);
      }
      if (args.title) {
        whereClause.push(`${billsTable}.title = ?`);
        values.push(args.title);
      }
      if (args.description) {
        whereClause.push(`${billsTable}.description = ?`);
        values.push(args.description);
      }
      if (args.introduced_date) {
        whereClause.push(`${billsTable}.introduced_date = ?`);
        values.push(args.introduced_date);
      }
      if (args.passed) {
        whereClause.push(`${billsTable}.passed = ?`);
        values.push(args.passed);
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

  bill: {
    type: BillType,
    args: {
      id: { type: GraphQLInt },
      parliamentary_session_id: { type: GraphQLInt },
      code: { type: GraphQLString },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      introduced_date: { type: DateScalar },
      passed: { type: GraphQLBoolean },
    },
    where: (billTable, args, _context, _resolveInfo) => {
      const whereClause = [];
      const values = [];
      if (args.id) {
        whereClause.push(`${billTable}.id = ?`);
        values.push(args.id);
      }
      if (args.parliamentary_session_id) {
        whereClause.push(`${billTable}.parliamentary_session_id = ?`);
        values.push(args.parliamentary_session_id);
      }
      if (args.code) {
        whereClause.push(`${billTable}.code = ?`);
        values.push(args.code);
      }
      if (args.title) {
        whereClause.push(`${billTable}.title = ?`);
        values.push(args.title);
      }
      if (args.description) {
        whereClause.push(`${billTable}.description = ?`);
        values.push(args.description);
      }
      if (args.introduced_date) {
        whereClause.push(`${billTable}.introduced_date = ?`);
        values.push(args.introduced_date);
      }
      if (args.passed) {
        whereClause.push(`${billTable}.passed = ?`);
        values.push(args.passed);
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

export { billQueries };
