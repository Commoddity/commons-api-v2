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
    start_date: { type: DateScalar },
    end_date: { type: DateScalar },
    created_at: { type: GraphQLDateTime },
    parliamentary_sessions: {
      description: "Parliamentary sessions for this parliament",
      type: GraphQLList(Bill),
      extensions: {
        joinMonster: {
          sqlJoin: (
            parliamentarySessionTable: string,
            parliamentTable: string,
          ) =>
            `${parliamentarySessionTable}.parliament_id = ${parliamentTable}.id`,
        },
      },
    },
  }),
});

export const ParliamentarySession: GraphQLObjectType = new GraphQLObjectType({
  name: "ParliamentarySession",
  extensions: {
    joinMonster: {
      sqlTable: "ParliamentarySession",
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    parliament_id: {
      type: Parliament,
      extensions: {
        joinMonster: {
          sqlJoin: (
            parliamentarySessionTable: string,
            parliamentTable: string,
          ) =>
            `${parliamentarySessionTable}.parliament_id = ${parliamentTable}.id`,
        },
      },
    },
    number: { type: GraphQLNonNull(GraphQLString) },
    start_date: { type: DateScalar },
    end_date: { type: DateScalar },
    created_at: { type: GraphQLDateTime },
    bills: {
      description: "Bills for this parliamentary session",
      type: GraphQLList(Bill),
      extensions: {
        joinMonster: {
          sqlJoin: (billTable: string, parliamentarySessionTable: string) =>
            `${billTable}.parliamentary_session_id = ${parliamentarySessionTable}.id`,
        },
      },
    },
  }),
});
