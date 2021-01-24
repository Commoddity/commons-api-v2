"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBill = void 0;
const graphql_1 = require("graphql");
const graphql_iso_date_1 = require("graphql-iso-date");
exports.UserBill = new graphql_1.GraphQLObjectType({
    name: "UserBill",
    extensions: {
        joinMonster: {
            sqlTable: "user_bills",
            uniqueKey: ["user_id", "bill_id"],
        },
    },
    fields: () => ({
        user_id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        bill_id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        created_at: { type: graphql_iso_date_1.GraphQLDateTime },
    }),
});
