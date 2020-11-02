import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

import { BillType, UserType } from "@graphql";

const CategoryType: GraphQLObjectType = new GraphQLObjectType({
  name: "Category",
  extensions: {
    joinMonster: {
      sqlTable: "categories",
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), sqlColumn: "id" },
    name: { type: GraphQLString, sqlColumn: "name" },
    uclassify_class: { type: GraphQLString, sqlColumn: "uclassify_class" },
    created_at: { type: GraphQLDateTime, sqlColumn: "created_at" },
    users: {
      description: "Users following this category",
      type: new GraphQLList(UserType),
      junction: {
        sqlTable: "user_categories",
        sqlJoins: [
          (categoryTable: string, userCategoriesTable: string) =>
            `${categoryTable}.id = ${userCategoriesTable}.category_id`,
          (userCategoriesTable: string, userTable: string) =>
            `${userCategoriesTable}.user_id = ${userTable}.id`,
        ],
      },
    },
    bills: {
      description: "Bills associated with this category",
      type: new GraphQLList(BillType),
      junction: {
        sqlTable: "bill_categories",
        sqlJoins: [
          (categoryTable: string, billCategoriesTable: string) =>
            `${categoryTable}.id = ${billCategoriesTable}.category_id`,
          (billCategoriesTable: string, billTable: string) =>
            `${billCategoriesTable}.bill_id = ${billTable}.id`,
        ],
      },
    },
  }),
});

export { CategoryType };
