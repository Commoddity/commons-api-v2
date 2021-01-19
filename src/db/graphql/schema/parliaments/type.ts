import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { Bill } from "../bills";
import { DateScalar } from "../../scalars";

export const Parliament: GraphQLObjectType = new GraphQLObjectType({
  name: "Parliament",
  extensions: {
    joinMonster: {
      sqlTable: "parliaments",
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    number: { type: GraphQLNonNull(GraphQLInt) },
    start_date: { type: DateScalar },
    end_date: { type: DateScalar },
    created_at: { type: GraphQLDateTime },
    parliamentary_sessions: {
      description: "Parliamentary sessions for this parliament",
      type: GraphQLList(ParliamentarySession),
      extensions: {
        joinMonster: {
          sqlJoin: (
            parliamentTable: string,
            parliamentarySessionTable: string,
          ) =>
            `${parliamentTable}.id = ${parliamentarySessionTable}.parliament_id`,
        },
      },
    },
  }),
});

export const ParliamentarySession: GraphQLObjectType = new GraphQLObjectType({
  name: "ParliamentarySession",
  extensions: {
    joinMonster: {
      sqlTable: "parliamentary_sessions",
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    parliament_id: { type: GraphQLNonNull(GraphQLInt) },
    number: { type: GraphQLNonNull(GraphQLString) },
    start_date: { type: DateScalar },
    end_date: { type: DateScalar },
    created_at: { type: GraphQLDateTime },
    bills: {
      description: "Bills for this parliamentary session",
      type: GraphQLList(Bill),
      extensions: {
        joinMonster: {
          sqlJoin: (parliamentarySessionTable: string, billTable: string) =>
            `${parliamentarySessionTable}.id = ${billTable}.parliamentary_session_id`,
        },
      },
    },
  }),
});
