import joinMonster from "join-monster";
import sqlString from "sqlstring";
import { GraphQLList, GraphQLNonNull, GraphQLInt } from "graphql";

import { db } from "@config";

import { ParliamentType, ParliamentarySessionType } from "./types";

const parliamentQueries: GraphQLFields = {
  parliaments: {
    type: new GraphQLList(ParliamentType),
    args: {
      id: { type: GraphQLNonNull(GraphQLInt) },
    },
    where: (parliamentsTable, args, _context, _resolveInfo) => {
      const whereClause: string[] = [];
      const values: any[] = [];
      if (args.id) {
        whereClause.push(`${parliamentsTable}.id = ?`);
        values.push(args.id);
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

  parliament: {
    type: ParliamentType,
    args: {
      id: { type: GraphQLNonNull(GraphQLInt) },
    },
    where: (parliamentTable, args, _context, _resolveInfo) => {
      const whereClause: string[] = [];
      const values: any[] = [];
      if (args.id) {
        whereClause.push(`${parliamentTable}.id = ?`);
        values.push(args.id);
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

  // Parliamentary Session Type Queries
  parliamentarySessions: {
    type: new GraphQLList(ParliamentarySessionType),
    args: {
      id: { type: GraphQLInt },
      parliament_id: { type: GraphQLInt },
      number: { type: GraphQLInt },
    },
    where: (parliamentarySessionsTable, args, _context, _resolveInfo) => {
      const whereClause: string[] = [];
      const values: any[] = [];
      if (args.id) {
        whereClause.push(`${parliamentarySessionsTable}.id = ?`);
        values.push(args.id);
      }
      if (args.parliament_id) {
        whereClause.push(`${parliamentarySessionsTable}.parliament_id = ?`);
        values.push(args.parliament_id);
      }
      if (args.number) {
        whereClause.push(`${parliamentarySessionsTable}.number = ?`);
        values.push(args.number);
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

  parliamentarySession: {
    type: ParliamentarySessionType,
    args: {
      id: { type: GraphQLInt },
      parliament_id: { type: GraphQLInt },
      number: { type: GraphQLInt },
    },
    where: (parliamentarySessionTable, args, _context, _resolveInfo) => {
      const whereClause: string[] = [];
      const values: any[] = [];
      if (args.id) {
        whereClause.push(`${parliamentarySessionTable}.id = ?`);
        values.push(args.id);
      }
      if (args.parliament_id) {
        whereClause.push(`${parliamentarySessionTable}.parliament_id = ?`);
        values.push(args.parliament_id);
      }
      if (args.number) {
        whereClause.push(`${parliamentarySessionTable}.number = ?`);
        values.push(args.number);
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

export { parliamentQueries };
