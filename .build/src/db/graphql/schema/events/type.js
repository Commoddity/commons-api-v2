"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const graphql_1 = require("graphql");
const graphql_iso_date_1 = require("graphql-iso-date");
const scalars_1 = require("../../scalars");
exports.Event = new graphql_1.GraphQLObjectType({
    name: "Event",
    extensions: {
        joinMonster: {
            sqlTable: "events",
            uniqueKey: "id",
        },
    },
    fields: () => ({
        id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        bill_code: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        title: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        publication_date: { type: scalars_1.DateScalar },
        created_at: { type: graphql_iso_date_1.GraphQLDateTime },
    }),
});
