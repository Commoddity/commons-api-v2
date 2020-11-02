import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

import {
  CategoryType,
  EventType,
  ParliamentarySessionType,
  UserType,
} from "@graphql";

import { DateScalar } from "../../scalars";

const BillType = new GraphQLObjectType({
  name: "Bill",
  extensions: {
    joinMonster: {
      sqlTable: "bills",
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), sqlColumn: "id" },
    parliamentary_session_id: {
      type: ParliamentarySessionType,
      sqlColumn: "parliamentary_session_id",
      sqlJoin: (billTable: string, parliamentarySessionTable: string) =>
        `${billTable}.parliamentary_session_id = ${parliamentarySessionTable}.id`,
    },
    code: { type: GraphQLNonNull(GraphQLString), sqlColumn: "code" },
    title: { type: GraphQLNonNull(GraphQLString), sqlColumn: "title" },
    description: {
      type: GraphQLString,
      sqlColumn: "description",
    },
    introduced_date: { type: DateScalar, sqlColumn: "introduced_date" },
    summary_url: { type: GraphQLString, sqlColumn: "summary_url" },
    page_url: { type: GraphQLString, sqlColumn: "page_url" },
    full_text_url: { type: GraphQLString, sqlColumn: "full_text_url" },
    passed: { type: GraphQLBoolean, sqlColumn: "passed" },
    created_at: { type: GraphQLDateTime, sqlColumn: "created_at" },
    events: {
      description: "Events related this this bill",
      type: GraphQLList(EventType),
      sqlJoin: (billTable: string, eventTable: string) =>
        `${billTable}.code = ${eventTable}.bill_code`,
    },
    categories: {
      description: "Categories associated with this bill",
      type: new GraphQLList(CategoryType),
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
    users: {
      description: "Users following this bill",
      type: new GraphQLList(UserType),
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
  }),
});

export { BillType };
