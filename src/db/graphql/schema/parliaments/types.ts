import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

import { BillType } from "@graphql";

import { DateScalar } from "../../scalars";

// Parliamentary Sessions
const ParliamentType: GraphQLObjectType = new GraphQLObjectType({
  name: "Parliament",
  extensions: {
    joinMonster: {
      sqlTable: "parliaments",
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), sqlColumn: "id" },
    start_date: { type: DateScalar, sqlColumn: "start_date" },
    end_date: { type: DateScalar, sqlColumn: "end_date" },
    created_at: { type: GraphQLDateTime, sqlColumn: "created_at" },
    parliamentary_sessions: {
      description: "Parliamentary sessions for this parliament",
      type: GraphQLList(BillType),
      sqlJoin: (parliamentarySessionTable: string, parliamentTable: string) =>
        `${parliamentarySessionTable}.parliament_id = ${parliamentTable}.id`,
    },
  }),
});

const ParliamentarySessionType: GraphQLObjectType = new GraphQLObjectType({
  name: "ParliamentarySession",
  extensions: {
    joinMonster: {
      sqlTable: "ParliamentarySession",
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), sqlColumn: "id" },
    parliament_id: {
      type: ParliamentType,
      sqlColumn: "parliament_id",
      sqlJoin: (parliamentarySessionTable: string, parliamentTable: string) =>
        `${parliamentarySessionTable}.parliament_id = ${parliamentTable}.id`,
    },
    number: { type: GraphQLNonNull(GraphQLString), sqlColumn: "number" },
    start_date: { type: DateScalar, sqlColumn: "start_date" },
    end_date: { type: DateScalar, sqlColumn: "end_date" },
    created_at: { type: GraphQLDateTime, sqlColumn: "created_at" },
    bills: {
      description: "Bills for this parliamentary session",
      type: GraphQLList(BillType),
      sqlJoin: (billTable: string, parliamentarySessionTable: string) =>
        `${billTable}.parliamentary_session_id = ${parliamentarySessionTable}.id`,
    },
  }),
});

export { ParliamentType, ParliamentarySessionType };
