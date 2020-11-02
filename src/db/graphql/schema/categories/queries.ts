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
      uclassify_class: { type: GraphQLString },
    },
    where: (categoriesTable, args, _context, _resolveInfo) => {
      const whereClause = [];
      const values = [];
      if (args.id) {
        whereClause.push(`${categoriesTable}.id = ?`);
        values.push(args.id);
      }
      if (args.name) {
        whereClause.push(`${categoriesTable}.name = ?`);
        values.push(args.name);
      }
      if (args.uclassify_class) {
        whereClause.push(`${categoriesTable}.uclassify_class = ?`);
        values.push(args.uclassify_class);
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
      uclassify_class: { type: GraphQLString },
    },
    where: (categoryTable, args, _context, _resolveInfo) => {
      const whereClause = [];
      const values = [];
      if (args.id) {
        whereClause.push(`${categoryTable}.id = ?`);
        values.push(args.id);
      }
      if (args.name) {
        whereClause.push(`${categoryTable}.name = ?`);
        values.push(args.name);
      }
      if (args.uclassify_class) {
        whereClause.push(`${categoryTable}.uclassify_class = ?`);
        values.push(args.uclassify_class);
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
