import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from "graphql";
import joinMonster from "join-monster";
import { db, QueryUtils } from "@db";
import { DateScalar } from "../../scalars";
import { Bill } from "./type";

const billQueries: GraphQLFields = {
  bills: {
    type: new GraphQLList(Bill),
    args: {
      id: { type: GraphQLInt },
      parliamentary_session_id: { type: GraphQLInt },
      code: { type: GraphQLString },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      introduced_date: { type: DateScalar },
      passed: { type: GraphQLBoolean },
    },
    extensions: {
      joinMonster: {
        where: (billsTable, args, _context) =>
          QueryUtils.createGraphQLWhereClause(billsTable, args),
      },
    },
    resolve: async (_parent, _args, _context, resolveInfo) =>
      joinMonster(resolveInfo, {}, async (sql: string) => db.any(sql)),
  },

  bill: {
    type: Bill,
    args: {
      id: { type: GraphQLInt },
      parliamentary_session_id: { type: GraphQLInt },
      code: { type: GraphQLString },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      introduced_date: { type: DateScalar },
      passed: { type: GraphQLBoolean },
    },
    extensions: {
      joinMonster: {
        where: (billsTable, args, _context) =>
          QueryUtils.createGraphQLWhereClause(billsTable, args),
      },
    },
    resolve: (_parent, _args, _context, resolveInfo) =>
      joinMonster(resolveInfo, {}, (sql: string) => db.one(sql)),
  },
};

export { billQueries };
