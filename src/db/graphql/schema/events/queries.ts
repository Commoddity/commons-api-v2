import joinMonster from "join-monster";
import sqlString from "sqlstring";
import { GraphQLInt, GraphQLList, GraphQLString } from "graphql";

import { db } from "@config";
import { GraphQLFields } from "@types";

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
      if (args.id) {
        whereClause.push(`${eventsTable}.id = ?`);
        values.push(args.id);
      }
      if (args.bill_code) {
        whereClause.push(`${eventsTable}.bill_code = ?`);
        values.push(args.bill_code);
      }
      if (args.title) {
        whereClause.push(`${eventsTable}.title = ?`);
        values.push(args.title);
      }
      if (args.publication_date) {
        whereClause.push(`${eventsTable}.publication_date = ?`);
        values.push(args.publication_date);
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
      if (args.id) {
        whereClause.push(`${eventTable}.id = ?`);
        values.push(args.id);
      }
      if (args.bill_code) {
        whereClause.push(`${eventTable}.bill_code = ?`);
        values.push(args.bill_code);
      }
      if (args.title) {
        whereClause.push(`${eventTable}.title = ?`);
        values.push(args.title);
      }
      if (args.publication_date) {
        whereClause.push(`${eventTable}.publication_date = ?`);
        values.push(args.publication_date);
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

export { eventQueries };
