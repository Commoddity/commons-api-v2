"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.billQueries = void 0;
const graphql_1 = require("graphql");
const join_monster_1 = __importDefault(require("join-monster"));
const scalars_1 = require("../../scalars");
const type_1 = require("./type");
const _services_1 = require("../../../../service");
const billQueries = {
    bills: {
        type: new graphql_1.GraphQLList(type_1.Bill),
        args: {
            id: { type: graphql_1.GraphQLInt },
            parliamentary_session_id: { type: graphql_1.GraphQLInt },
            code: { type: graphql_1.GraphQLString },
            title: { type: graphql_1.GraphQLString },
            description: { type: graphql_1.GraphQLString },
            introduced_date: { type: scalars_1.DateScalar },
            passed: { type: graphql_1.GraphQLBoolean },
        },
        extensions: {
            joinMonster: {
                where: (billsTable, args, _context) => _services_1.QueryUtils.createGraphQLWhereClause(billsTable, args),
            },
        },
        resolve: (_parent, _args, _context, resolveInfo) => join_monster_1.default(resolveInfo, {}, (sql) => new _services_1.BillsService().gqlFindManyBills(sql)),
    },
    bill: {
        type: type_1.Bill,
        args: {
            id: { type: graphql_1.GraphQLInt },
            parliamentary_session_id: { type: graphql_1.GraphQLInt },
            code: { type: graphql_1.GraphQLString },
            title: { type: graphql_1.GraphQLString },
            description: { type: graphql_1.GraphQLString },
            introduced_date: { type: scalars_1.DateScalar },
            passed: { type: graphql_1.GraphQLBoolean },
        },
        extensions: {
            joinMonster: {
                where: (billsTable, args, _context) => _services_1.QueryUtils.createGraphQLWhereClause(billsTable, args),
            },
        },
        resolve: (_parent, _args, _context, resolveInfo) => join_monster_1.default(resolveInfo, {}, (sql) => new _services_1.BillsService().gqlFindOneBill(sql)),
    },
};
exports.billQueries = billQueries;
