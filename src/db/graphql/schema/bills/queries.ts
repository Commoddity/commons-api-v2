import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from "graphql";
import joinMonster from "join-monster";
import { DateScalar } from "../../scalars";
import { Bill } from "./type";

import { BillsService, QueryUtils } from "@services";

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
    resolve: (_parent, _args, _context, resolveInfo) =>
      joinMonster(resolveInfo, {}, (sql: string) =>
        new BillsService().gqlFindManyBills(sql),
      ),
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
      joinMonster(resolveInfo, {}, (sql: string) =>
        new BillsService().gqlFindOneBill(sql),
      ),
  },
};

export { billQueries };
