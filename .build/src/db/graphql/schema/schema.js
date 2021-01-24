"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const root_mutation_1 = require("./root-mutation");
const root_query_1 = require("./root-query");
const schema = new graphql_1.GraphQLSchema({
    query: root_query_1.RootQuery,
    mutation: root_mutation_1.RootMutation,
});
exports.schema = schema;
