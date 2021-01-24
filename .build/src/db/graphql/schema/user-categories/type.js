"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCategoryType = void 0;
const graphql_1 = require("graphql");
const graphql_iso_date_1 = require("graphql-iso-date");
exports.UserCategoryType = new graphql_1.GraphQLObjectType({
    name: "UserCategory",
    extensions: {
        joinMonster: {
            sqlTable: "user_categories",
            uniqueKey: ["user_id", "category_id"],
        },
    },
    fields: () => ({
        user_id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        category_id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        created_at: { type: graphql_iso_date_1.GraphQLDateTime },
    }),
});
