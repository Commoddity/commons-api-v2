"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bill = void 0;
const graphql_1 = require("graphql");
const graphql_iso_date_1 = require("graphql-iso-date");
const categories_1 = require("../categories");
const events_1 = require("../events");
const users_1 = require("../users");
const scalars_1 = require("../../scalars");
exports.Bill = new graphql_1.GraphQLObjectType({
    name: "Bill",
    extensions: {
        joinMonster: {
            sqlTable: "bills",
            uniqueKey: "id",
        },
    },
    fields: () => ({
        id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        parliamentary_session_id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        code: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        title: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        description: { type: graphql_1.GraphQLString },
        introduced_date: { type: scalars_1.DateScalar },
        summary_url: { type: graphql_1.GraphQLString },
        page_url: { type: graphql_1.GraphQLString },
        full_text_url: { type: graphql_1.GraphQLString },
        passed: { type: graphql_1.GraphQLBoolean },
        created_at: { type: graphql_iso_date_1.GraphQLDateTime },
        events: {
            description: "Events related to this bill",
            type: graphql_1.GraphQLList(events_1.Event),
            extensions: {
                joinMonster: {
                    sqlJoin: (billTable, eventTable) => `${billTable}.code = ${eventTable}.bill_code`,
                },
            },
        },
        categories: {
            description: "Categories associated with this bill",
            type: new graphql_1.GraphQLList(categories_1.Category),
            extensions: {
                joinMonster: {
                    junction: {
                        sqlTable: "bill_categories",
                        sqlJoins: [
                            (billTable, billCategoriesTable) => `${billTable}.id = ${billCategoriesTable}.bill_id`,
                            (billCategoriesTable, categoryTable) => `${billCategoriesTable}.category_id = ${categoryTable}.id`,
                        ],
                    },
                },
            },
        },
        users: {
            description: "Users following this bill",
            type: new graphql_1.GraphQLList(users_1.User),
            extensions: {
                joinMonster: {
                    junction: {
                        sqlTable: "user_bills",
                        sqlJoins: [
                            (billTable, userBillsTable) => `${billTable}.id = ${userBillsTable}.bill_id`,
                            (userBillsTable, userTable) => `${userBillsTable}.user_id = ${userTable}.id`,
                        ],
                    },
                },
            },
        },
    }),
});
