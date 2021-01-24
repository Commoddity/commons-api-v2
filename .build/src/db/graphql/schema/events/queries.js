"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventQueries = void 0;
const join_monster_1 = __importDefault(require("join-monster"));
const graphql_1 = require("graphql");
const scalars_1 = require("../../scalars");
const type_1 = require("./type");
const _services_1 = require("@services");
exports.eventQueries = {
    events: {
        type: new graphql_1.GraphQLList(type_1.Event),
        args: {
            id: { type: graphql_1.GraphQLInt },
            bill_code: { type: graphql_1.GraphQLString },
            title: { type: graphql_1.GraphQLString },
            publication_date: { type: scalars_1.DateScalar },
        },
        extensions: {
            joinMonster: {
                where: (eventsTable, args, _context) => _services_1.QueryUtils.createGraphQLWhereClause(eventsTable, args),
            },
        },
        resolve: (_parent, _args, _context, resolveInfo) => join_monster_1.default(resolveInfo, {}, (sql) => new _services_1.EventsService().gqlFindManyEvents(sql)),
    },
    event: {
        type: type_1.Event,
        args: {
            id: { type: graphql_1.GraphQLInt },
            bill_code: { type: graphql_1.GraphQLString },
            title: { type: graphql_1.GraphQLString },
            publication_date: { type: scalars_1.DateScalar },
        },
        extensions: {
            joinMonster: {
                where: (eventTable, args, _context) => _services_1.QueryUtils.createGraphQLWhereClause(eventTable, args),
            },
        },
        resolve: (_parent, _args, _context, resolveInfo) => join_monster_1.default(resolveInfo, {}, (sql) => new _services_1.EventsService().gqlFindOneEvent(sql)),
    },
};
