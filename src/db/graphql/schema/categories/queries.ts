import joinMonster from "join-monster";
import sqlString from "sqlstring";
import { GraphQLList, GraphQLInt, GraphQLString } from "graphql";

import { db } from "@config";
import { GraphQLFields } from "@types";

import { CategoryType } from "./types";

const categoryQueries: GraphQLFields = {
  categories: {
    type: new GraphQLList(CategoryType),
    args: {
      id: { type: GraphQLInt },
      name: { type: GraphQLString },
      class_code: { type: GraphQLString },
    },
    where: (categoriesTable, args, _context, _resolveInfo) => {
      const whereClause: string[] = [];
      const values: any[] = [];
      if (args.id) {
        whereClause.push(`${categoriesTable}.id = ?`);
        values.push(args.id);
      }
      if (args.name) {
        whereClause.push(`${categoriesTable}.name = ?`);
        values.push(args.name);
      }
      if (args.class_code) {
        whereClause.push(`${categoriesTable}.class_code = ?`);
        values.push(args.class_code);
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

  category: {
    type: CategoryType,
    args: {
      id: { type: GraphQLInt },
      name: { type: GraphQLString },
      class_code: { type: GraphQLString },
    },
    where: (categoryTable, args, _context, _resolveInfo) => {
      const whereClause: string[] = [];
      const values: any[] = [];
      if (args.id) {
        whereClause.push(`${categoryTable}.id = ?`);
        values.push(args.id);
      }
      if (args.name) {
        whereClause.push(`${categoryTable}.name = ?`);
        values.push(args.name);
      }
      if (args.class_code) {
        whereClause.push(`${categoryTable}.class_code = ?`);
        values.push(args.class_code);
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

export { categoryQueries };
