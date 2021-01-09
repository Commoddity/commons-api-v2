import joinMonster from "join-monster";
import sqlString from "sqlstring";
import { GraphQLInt, GraphQLList, GraphQLString } from "graphql";

import { db } from "@config";

import { DateScalar } from "../../scalars";
import { EventType } from "./types";

const eventQueries: GraphQLFields = {
  events: {
    type: new GraphQLList(EventType),
    args: {
      id: { type: GraphQLInt },
      bill_code: { type: GraphQLString },
      title: { type: GraphQLString },
      publication_date: { type: DateScalar },
    },
    where: (eventsTable, args, _context, _resolveInfo) => {
      const whereClause: string[] = [];
      const values: any[] = [];

      Object.entries(args).forEach(([arg, value]) => {
        whereClause.push(`${eventsTable}.${arg} = ?`);
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

  event: {
    type: EventType,
    args: {
      id: { type: GraphQLInt },
      bill_code: { type: GraphQLString },
      title: { type: GraphQLString },
      publication_date: { type: DateScalar },
    },
    where: (eventTable, args, _context, _resolveInfo) => {
      const whereClause: string[] = [];
      const values: any[] = [];

      Object.entries(args).forEach(([arg, value]) => {
        whereClause.push(`${eventTable}.${arg} = ?`);
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

export { eventQueries };
