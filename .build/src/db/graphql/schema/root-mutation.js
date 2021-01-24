"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootMutation = void 0;
const graphql_1 = require("graphql");
const users_1 = require("./users");
const user_bills_1 = require("./user-bills");
const user_categories_1 = require("./user-categories");
const RootMutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: () => (Object.assign(Object.assign(Object.assign({}, users_1.userMutations), user_bills_1.userBillMutations), user_categories_1.userCategoryMutations)),
});
exports.RootMutation = RootMutation;
