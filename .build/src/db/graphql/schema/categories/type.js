"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const graphql_1 = require("graphql");
const graphql_iso_date_1 = require("graphql-iso-date");
const bills_1 = require("../bills");
const users_1 = require("../users");
exports.Category = new graphql_1.GraphQLObjectType({
    name: "Category",
    extensions: {
        joinMonster: {
            sqlTable: "categories",
            uniqueKey: "id",
        },
    },
    fields: () => ({
        id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        name: { type: graphql_1.GraphQLString },
        class_code: { type: graphql_1.GraphQLString },
        created_at: { type: graphql_iso_date_1.GraphQLDateTime },
        users: {
            description: "Users following this category",
            type: new graphql_1.GraphQLList(users_1.User),
            extensions: {
                joinMonster: {
                    junction: {
                        sqlTable: "user_categories",
                        sqlJoins: [
                            (categoryTable, userCategoriesTable) => `${categoryTable}.id = ${userCategoriesTable}.category_id`,
                            (userCategoriesTable, userTable) => `${userCategoriesTable}.user_id = ${userTable}.id`,
                        ],
                    },
                },
            },
        },
        bills: {
            description: "Bills associated with this category",
            type: new graphql_1.GraphQLList(bills_1.Bill),
            extensions: {
                joinMonster: {
                    junction: {
                        sqlTable: "bill_categories",
                        sqlJoins: [
                            (categoryTable, billCategoriesTable) => `${categoryTable}.id = ${billCategoriesTable}.category_id`,
                            (billCategoriesTable, billTable) => `${billCategoriesTable}.bill_id = ${billTable}.id`,
                        ],
                    },
                },
            },
        },
    }),
});
