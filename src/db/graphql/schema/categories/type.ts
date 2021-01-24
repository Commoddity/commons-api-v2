import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { Bill } from "../bills";
import { User } from "../users";

export const Category: GraphQLObjectType = new GraphQLObjectType({
  name: "Category",
  extensions: {
    joinMonster: {
      sqlTable: "categories",
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    class_code: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    users: {
      description: "Users following this category",
      type: new GraphQLList(User),
      extensions: {
        joinMonster: {
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
      },
    },
    bills: {
      description: "Bills associated with this category",
      type: new GraphQLList(Bill),
      extensions: {
        joinMonster: {
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
      },
    },
  }),
});
