import joinMonster from "join-monster";
import { GraphQLList, GraphQLInt, GraphQLString } from "graphql";
import { db, QueryUtils } from "@db";
import { Category } from "./type";

export const categoryQueries: GraphQLFields = {
  categories: {
    type: new GraphQLList(Category),
    args: {
      id: { type: GraphQLInt },
      name: { type: GraphQLString },
      class_code: { type: GraphQLString },
    },
    extensions: {
      joinMonster: {
        where: (categoriesTable, args, _context) =>
          QueryUtils.createGraphQLWhereClause(categoriesTable, args),
      },
    },
    resolve: (_parent, _args, _context, resolveInfo) =>
      joinMonster(resolveInfo, {}, (sql: string) => db.any(sql)),
  },

  category: {
    type: Category,
    args: {
      id: { type: GraphQLInt },
      name: { type: GraphQLString },
      class_code: { type: GraphQLString },
    },
    extensions: {
      joinMonster: {
        where: (categoryTable, args, _context) =>
          QueryUtils.createGraphQLWhereClause(categoryTable, args),
      },
    },
    resolve: (_parent, _args, _context, resolveInfo) =>
      joinMonster(resolveInfo, {}, (sql: string) => db.one(sql)),
  },
};
