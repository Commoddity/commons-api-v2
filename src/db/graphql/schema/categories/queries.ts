import joinMonster from "join-monster";
import { GraphQLList, GraphQLInt, GraphQLString } from "graphql";
import { Category } from "./type";

import { CategoriesService, QueryUtils } from "@services";

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
      joinMonster(resolveInfo, {}, (sql: string) =>
        new CategoriesService().gqlFindManyCategories(sql),
      ),
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
      joinMonster(resolveInfo, {}, (sql: string) =>
        new CategoriesService().gqlFindOneCategory(sql),
      ),
  },
};
