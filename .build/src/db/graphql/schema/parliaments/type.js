"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParliamentarySession = exports.Parliament = void 0;
const graphql_1 = require("graphql");
const graphql_iso_date_1 = require("graphql-iso-date");
const bills_1 = require("../bills");
const scalars_1 = require("../../scalars");
exports.Parliament = new graphql_1.GraphQLObjectType({
    name: "Parliament",
    extensions: {
        joinMonster: {
            sqlTable: "parliaments",
            uniqueKey: "id",
        },
    },
    fields: () => ({
        id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        number: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        start_date: { type: scalars_1.DateScalar },
        end_date: { type: scalars_1.DateScalar },
        created_at: { type: graphql_iso_date_1.GraphQLDateTime },
        parliamentary_sessions: {
            description: "Parliamentary sessions for this parliament",
            type: graphql_1.GraphQLList(exports.ParliamentarySession),
            extensions: {
                joinMonster: {
                    sqlJoin: (parliamentTable, parliamentarySessionTable) => `${parliamentTable}.id = ${parliamentarySessionTable}.parliament_id`,
                },
            },
        },
    }),
});
exports.ParliamentarySession = new graphql_1.GraphQLObjectType({
    name: "ParliamentarySession",
    extensions: {
        joinMonster: {
            sqlTable: "parliamentary_sessions",
            uniqueKey: "id",
        },
    },
    fields: () => ({
        id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        parliament_id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        number: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        start_date: { type: scalars_1.DateScalar },
        end_date: { type: scalars_1.DateScalar },
        created_at: { type: graphql_iso_date_1.GraphQLDateTime },
        bills: {
            description: "Bills for this parliamentary session",
            type: graphql_1.GraphQLList(bills_1.Bill),
            extensions: {
                joinMonster: {
                    sqlJoin: (parliamentarySessionTable, billTable) => `${parliamentarySessionTable}.id = ${billTable}.parliamentary_session_id`,
                },
            },
        },
    }),
});
