import joinMonster from "join-monster";
import sqlString from "sqlstring";
import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from "graphql";

import { db } from "@config";

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
      const whereClause: string[] = [];
      const values: any[] = [];

      Object.entries(args).forEach(([arg, value]) => {
        whereClause.push(`${billsTable}.${arg} = ?`);
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
      const whereClause: string[] = [];
      const values: any[] = [];

      Object.entries(args).forEach(([arg, value]) => {
        whereClause.push(`${billTable}.${arg} = ?`);
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

export { billQueries };
