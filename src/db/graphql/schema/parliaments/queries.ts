import joinMonster from "join-monster";
import { GraphQLList, GraphQLNonNull, GraphQLInt } from "graphql";
import { Parliament, ParliamentarySession } from "./type";

import { ParliamentsService, QueryUtils } from "@services";

export const parliamentQueries: GraphQLFields = {
  parliaments: {
    type: new GraphQLList(Parliament),
    args: {
      id: { type: GraphQLNonNull(GraphQLInt) },
    },
    extensions: {
      joinMonster: {
        where: (parliamentsTable, args, _context) =>
          QueryUtils.createGraphQLWhereClause(parliamentsTable, args),
      },
    },
    resolve: (_parent, _args, _context, resolveInfo) =>
      joinMonster(resolveInfo, {}, (sql: string) =>
        new ParliamentsService().gqlFindManyParliaments(sql),
      ),
  },

  parliament: {
    type: Parliament,
    args: {
      id: { type: GraphQLNonNull(GraphQLInt) },
    },
    extensions: {
      joinMonster: {
        where: (parliamentTable, args, _context) =>
          QueryUtils.createGraphQLWhereClause(parliamentTable, args),
      },
    },
    resolve: (_parent, _args, _context, resolveInfo) =>
      joinMonster(resolveInfo, {}, (sql: string) =>
        new ParliamentsService().gqlFindOneParliament(sql),
      ),
  },

  parliamentarySessions: {
    type: new GraphQLList(ParliamentarySession),
    args: {
      id: { type: GraphQLInt },
      parliament_id: { type: GraphQLInt },
      number: { type: GraphQLInt },
    },
    extensions: {
      joinMonster: {
        where: (parliamentarySessionsTable, args, _context) =>
          QueryUtils.createGraphQLWhereClause(parliamentarySessionsTable, args),
      },
    },
    resolve: (_parent, _args, _context, resolveInfo) =>
      joinMonster(resolveInfo, {}, (sql: string) =>
        new ParliamentsService().gqlFindManyParliamentarySessions(sql),
      ),
  },

  parliamentarySession: {
    type: ParliamentarySession,
    args: {
      id: { type: GraphQLInt },
      parliament_id: { type: GraphQLInt },
      number: { type: GraphQLInt },
    },
    extensions: {
      joinMonster: {
        where: (parliamentarySessionTable, args, _context) =>
          QueryUtils.createGraphQLWhereClause(parliamentarySessionTable, args),
      },
    },
    resolve: (_parent, _args, _context, resolveInfo) =>
      joinMonster(resolveInfo, {}, (sql: string) =>
        new ParliamentsService().gqlFindOneParliamentarySession(sql),
      ),
  },
};
