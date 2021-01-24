"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryQueries = void 0;
const join_monster_1 = __importDefault(require("join-monster"));
const graphql_1 = require("graphql");
const type_1 = require("./type");
const _services_1 = require("@services");
exports.categoryQueries = {
    categories: {
        type: new graphql_1.GraphQLList(type_1.Category),
        args: {
            id: { type: graphql_1.GraphQLInt },
            name: { type: graphql_1.GraphQLString },
            class_code: { type: graphql_1.GraphQLString },
        },
        extensions: {
            joinMonster: {
                where: (categoriesTable, args, _context) => _services_1.QueryUtils.createGraphQLWhereClause(categoriesTable, args),
            },
        },
        resolve: (_parent, _args, _context, resolveInfo) => join_monster_1.default(resolveInfo, {}, (sql) => new _services_1.CategoriesService().gqlFindManyCategories(sql)),
    },
    category: {
        type: type_1.Category,
        args: {
            id: { type: graphql_1.GraphQLInt },
            name: { type: graphql_1.GraphQLString },
            class_code: { type: graphql_1.GraphQLString },
        },
        extensions: {
            joinMonster: {
                where: (categoryTable, args, _context) => _services_1.QueryUtils.createGraphQLWhereClause(categoryTable, args),
            },
        },
        resolve: (_parent, _args, _context, resolveInfo) => join_monster_1.default(resolveInfo, {}, (sql) => new _services_1.CategoriesService().gqlFindOneCategory(sql)),
    },
};
