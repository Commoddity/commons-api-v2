import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { Bill } from "../bills";
import { Category } from "../categories";
import { NotificationEnumType } from "../../enums";

const User: GraphQLObjectType = new GraphQLObjectType({
  name: "User",
  extensions: {
    joinMonster: {
      sqlTable: "users",
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), sqlColumn: "id" },
    first_name: {
      type: GraphQLNonNull(GraphQLString),
      sqlColumn: "first_name",
    },
    last_name: { type: GraphQLNonNull(GraphQLString), sqlColumn: "last_name" },
    username: { type: GraphQLNonNull(GraphQLString), sqlColumn: "username" },
    email: { type: GraphQLNonNull(GraphQLString), sqlColumn: "email" },
    phone_number: { type: GraphQLInt, sqlColumn: "phone_number" },
    postal_code: { type: GraphQLInt, sqlColumn: "postal_code" },
    email_notification: {
      type: NotificationEnumType,
      sqlColumn: "email_notification",
    },
    sms_notification: {
      type: NotificationEnumType,
      sqlColumn: "sms_notification",
    },
    active: { type: GraphQLBoolean, sqlColumn: "active" },
    created_at: { type: GraphQLDateTime, sqlColumn: "created_at" },
    bills: {
      description: "Bills followed by this user",
      type: new GraphQLList(Bill),
      junction: {
        sqlTable: "user_bills",
        sqlJoins: [
          (userTable: string, userBillsTable: string) =>
            `${userTable}.id = ${userBillsTable}.user_id`,
          (userBillsTable: string, billTable: string) =>
            `${userBillsTable}.bill_id = ${billTable}.id`,
        ],
      },
    },
    categories: {
      description: "Categories followed by this user",
      type: new GraphQLList(Category),
      junction: {
        sqlTable: "user_categories",
        sqlJoins: [
          (userTable: string, userCategoriesTable: string) =>
            `${userTable}.id = ${userCategoriesTable}.user_id`,
          (userCategoriesTable: string, categoryTable: string) =>
            `${userCategoriesTable}.category_id = ${categoryTable}.id`,
        ],
      },
    },
  }),
});

export { User };
