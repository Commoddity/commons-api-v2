import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { Category } from "../categories";
import { Event } from "../events";
import { User } from "../users";
import { DateScalar } from "../../scalars";

export const Bill = new GraphQLObjectType({
  name: "Bill",
  extensions: {
    joinMonster: {
      sqlTable: "bills",
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    parliamentary_session_id: { type: GraphQLNonNull(GraphQLInt) },
    code: { type: GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    introduced_date: { type: DateScalar },
    summary_url: { type: GraphQLString },
    page_url: { type: GraphQLString },
    full_text_url: { type: GraphQLString },
    passed: { type: GraphQLBoolean },
    created_at: { type: GraphQLDateTime },
    events: {
      description: "Events related to this bill",
      type: GraphQLList(Event),
      extensions: {
        joinMonster: {
          sqlJoin: (billTable: string, eventTable: string) =>
            `${billTable}.code = ${eventTable}.bill_code`,
        },
      },
    },
    categories: {
      description: "Categories associated with this bill",
      type: new GraphQLList(Category),
      extensions: {
        joinMonster: {
          junction: {
            sqlTable: "bill_categories",
            sqlJoins: [
              (billTable: string, billCategoriesTable: string) =>
                `${billTable}.id = ${billCategoriesTable}.bill_id`,
              (billCategoriesTable: string, categoryTable: string) =>
                `${billCategoriesTable}.category_id = ${categoryTable}.id`,
            ],
          },
        },
      },
    },
    users: {
      description: "Users following this bill",
      type: new GraphQLList(User),
      extensions: {
        joinMonster: {
          junction: {
            sqlTable: "user_bills",
            sqlJoins: [
              (billTable: string, userBillsTable: string) =>
                `${billTable}.id = ${userBillsTable}.bill_id`,
              (userBillsTable: string, userTable: string) =>
                `${userBillsTable}.user_id = ${userTable}.id`,
            ],
          },
        },
      },
    },
  }),
});
