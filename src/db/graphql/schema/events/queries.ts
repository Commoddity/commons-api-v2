import joinMonster from "join-monster";
import { GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import { DateScalar } from "../../scalars";
import { Event } from "./type";

import { EventsService, QueryUtils } from "@services";

export const eventQueries: GraphQLFields = {
  events: {
    type: new GraphQLList(Event),
    args: {
      id: { type: GraphQLInt },
      bill_code: { type: GraphQLString },
      title: { type: GraphQLString },
      publication_date: { type: DateScalar },
    },
    extensions: {
      joinMonster: {
        where: (eventsTable, args, _context) =>
          QueryUtils.createGraphQLWhereClause(eventsTable, args),
      },
    },
    resolve: (_parent, _args, _context, resolveInfo) =>
      joinMonster(resolveInfo, {}, (sql: string) =>
        new EventsService().gqlFindManyEvents(sql),
      ),
  },

  event: {
    type: Event,
    args: {
      id: { type: GraphQLInt },
      bill_code: { type: GraphQLString },
      title: { type: GraphQLString },
      publication_date: { type: DateScalar },
    },
    extensions: {
      joinMonster: {
        where: (eventTable, args, _context) =>
          QueryUtils.createGraphQLWhereClause(eventTable, args),
      },
    },
    resolve: (_parent, _args, _context, resolveInfo) =>
      joinMonster(resolveInfo, {}, (sql: string) =>
        new EventsService().gqlFindOneEvent(sql),
      ),
  },
};
