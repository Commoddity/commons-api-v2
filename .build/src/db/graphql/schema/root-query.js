"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootQuery = void 0;
const graphql_1 = require("graphql");
const bills_1 = require("./bills");
const categories_1 = require("./categories");
const events_1 = require("./events");
const parliaments_1 = require("./parliaments");
const users_1 = require("./users");
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "Query",
    fields: () => (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, bills_1.billQueries), categories_1.categoryQueries), events_1.eventQueries), parliaments_1.parliamentQueries), users_1.userQueries)),
});
exports.RootQuery = RootQuery;
