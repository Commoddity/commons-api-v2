"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueries = void 0;
const graphql_1 = require("graphql");
const join_monster_1 = __importDefault(require("join-monster"));
const type_1 = require("./type");
const enums_1 = require("../../enums");
const _services_1 = require("@services");
exports.userQueries = {
    users: {
        type: new graphql_1.GraphQLList(type_1.User),
        args: {
            id: { type: graphql_1.GraphQLInt },
            first_name: { type: graphql_1.GraphQLString },
            last_name: { type: graphql_1.GraphQLString },
            email: { type: graphql_1.GraphQLString },
            phone_number: { type: graphql_1.GraphQLInt },
            email_notification: { type: enums_1.NotificationEnumType },
            sms_notification: { type: enums_1.NotificationEnumType },
            active: { type: graphql_1.GraphQLBoolean },
        },
        extensions: {
            joinMonster: {
                where: (usersTable, args, _context) => _services_1.QueryUtils.createGraphQLWhereClause(usersTable, args),
            },
        },
        resolve: (_parent, _args, _context, resolveInfo) => join_monster_1.default(resolveInfo, {}, (sql) => new _services_1.UsersService().gqlFindManyUsers(sql)),
    },
    user: {
        type: type_1.User,
        args: {
            id: { type: graphql_1.GraphQLInt },
            first_name: { type: graphql_1.GraphQLString },
            last_name: { type: graphql_1.GraphQLString },
            email: { type: graphql_1.GraphQLString },
            phone_number: { type: graphql_1.GraphQLInt },
            email_notification: { type: enums_1.NotificationEnumType },
            sms_notification: { type: enums_1.NotificationEnumType },
            active: { type: graphql_1.GraphQLBoolean },
        },
        extensions: {
            joinMonster: {
                where: (userTable, args, _context) => _services_1.QueryUtils.createGraphQLWhereClause(userTable, args),
            },
        },
        resolve: (_parent, _args, _context, resolveInfo) => join_monster_1.default(resolveInfo, {}, (sql) => new _services_1.UsersService().gqlFindOneUser(sql)),
    },
};
