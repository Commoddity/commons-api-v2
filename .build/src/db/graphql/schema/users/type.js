"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const graphql_1 = require("graphql");
const graphql_iso_date_1 = require("graphql-iso-date");
const bills_1 = require("../bills");
const categories_1 = require("../categories");
const enums_1 = require("../../enums");
const User = new graphql_1.GraphQLObjectType({
    name: "User",
    extensions: {
        joinMonster: {
            sqlTable: "users",
            uniqueKey: "id",
        },
    },
    fields: () => ({
        id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        first_name: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        last_name: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        email: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        phone_number: { type: graphql_1.GraphQLString },
        email_notification: { type: enums_1.NotificationEnumType },
        sms_notification: { type: enums_1.NotificationEnumType },
        active: { type: graphql_1.GraphQLBoolean },
        address: { type: graphql_1.GraphQLString },
        street: { type: graphql_1.GraphQLString },
        city: { type: graphql_1.GraphQLString },
        province: { type: graphql_1.GraphQLString },
        postal_code: { type: graphql_1.GraphQLString },
        mp: { type: graphql_1.GraphQLString },
        party: { type: graphql_1.GraphQLString },
        riding_name: { type: graphql_1.GraphQLString },
        created_at: { type: graphql_iso_date_1.GraphQLDateTime },
        bills: {
            description: "Bills followed by this user",
            type: new graphql_1.GraphQLList(bills_1.Bill),
            extensions: {
                joinMonster: {
                    junction: {
                        sqlTable: "user_bills",
                        sqlJoins: [
                            (userTable, userBillsTable) => `${userTable}.id = ${userBillsTable}.user_id`,
                            (userBillsTable, billTable) => `${userBillsTable}.bill_id = ${billTable}.id`,
                        ],
                    },
                },
            },
        },
        categories: {
            description: "Categories followed by this user",
            type: new graphql_1.GraphQLList(categories_1.Category),
            extensions: {
                joinMonster: {
                    junction: {
                        sqlTable: "user_categories",
                        sqlJoins: [
                            (userTable, userCategoriesTable) => `${userTable}.id = ${userCategoriesTable}.user_id`,
                            (userCategoriesTable, categoryTable) => `${userCategoriesTable}.category_id = ${categoryTable}.id`,
                        ],
                    },
                },
            },
        },
    }),
});
exports.User = User;
