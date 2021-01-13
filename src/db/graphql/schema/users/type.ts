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
    id: { type: GraphQLNonNull(GraphQLInt) },
    first_name: { type: GraphQLNonNull(GraphQLString) },
    last_name: { type: GraphQLNonNull(GraphQLString) },
    username: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    phone_number: { type: GraphQLString },
    email_notification: { type: NotificationEnumType },
    sms_notification: { type: NotificationEnumType },
    active: { type: GraphQLBoolean },
    address: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    province: { type: GraphQLString },
    postal_code: { type: GraphQLString },
    mp: { type: GraphQLString },
    party: { type: GraphQLString },
    riding_name: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    bills: {
      description: "Bills followed by this user",
      type: new GraphQLList(Bill),
      extensions: {
        joinMonster: {
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
      },
    },
    categories: {
      description: "Categories followed by this user",
      type: new GraphQLList(Category),
      extensions: {
        joinMonster: {
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
      },
    },
  }),
});

export { User };
