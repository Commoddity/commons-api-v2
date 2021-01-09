import joinMonster from "join-monster";
import sqlString from "sqlstring";
import { GraphQLList, GraphQLInt, GraphQLString } from "graphql";

import { db } from "@config";

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

      Object.entries(args).forEach(([arg, value]) => {
        whereClause.push(`${categoriesTable}.${arg} = ?`);
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

      Object.entries(args).forEach(([arg, value]) => {
        whereClause.push(`${categoryTable}.${arg} = ?`);
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

export { categoryQueries };
