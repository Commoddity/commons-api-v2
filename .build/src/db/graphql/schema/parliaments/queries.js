"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parliamentQueries = void 0;
const join_monster_1 = __importDefault(require("join-monster"));
const graphql_1 = require("graphql");
const type_1 = require("./type");
const _services_1 = require("../../../../service");
exports.parliamentQueries = {
    parliaments: {
        type: new graphql_1.GraphQLList(type_1.Parliament),
        args: {
            id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
            number: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        },
        extensions: {
            joinMonster: {
                where: (parliamentsTable, args, _context) => _services_1.QueryUtils.createGraphQLWhereClause(parliamentsTable, args),
            },
        },
        resolve: (_parent, _args, _context, resolveInfo) => join_monster_1.default(resolveInfo, {}, (sql) => new _services_1.ParliamentsService().gqlFindManyParliaments(sql)),
    },
    parliament: {
        type: type_1.Parliament,
        args: {
            id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        },
        extensions: {
            joinMonster: {
                where: (parliamentTable, args, _context) => _services_1.QueryUtils.createGraphQLWhereClause(parliamentTable, args),
            },
        },
        resolve: (_parent, _args, _context, resolveInfo) => join_monster_1.default(resolveInfo, {}, (sql) => new _services_1.ParliamentsService().gqlFindOneParliament(sql)),
    },
    parliamentarySessions: {
        type: new graphql_1.GraphQLList(type_1.ParliamentarySession),
        args: {
            id: { type: graphql_1.GraphQLInt },
            parliament_id: { type: graphql_1.GraphQLInt },
            number: { type: graphql_1.GraphQLInt },
        },
        extensions: {
            joinMonster: {
                where: (parliamentarySessionsTable, args, _context) => _services_1.QueryUtils.createGraphQLWhereClause(parliamentarySessionsTable, args),
            },
        },
        resolve: (_parent, _args, _context, resolveInfo) => join_monster_1.default(resolveInfo, {}, (sql) => new _services_1.ParliamentsService().gqlFindManyParliamentarySessions(sql)),
    },
    parliamentarySession: {
        type: type_1.ParliamentarySession,
        args: {
            id: { type: graphql_1.GraphQLInt },
            parliament_id: { type: graphql_1.GraphQLInt },
            number: { type: graphql_1.GraphQLInt },
        },
        extensions: {
            joinMonster: {
                where: (parliamentarySessionTable, args, _context) => _services_1.QueryUtils.createGraphQLWhereClause(parliamentarySessionTable, args),
            },
        },
        resolve: (_parent, _args, _context, resolveInfo) => join_monster_1.default(resolveInfo, {}, (sql) => new _services_1.ParliamentsService().gqlFindOneParliamentarySession(sql)),
    },
};
