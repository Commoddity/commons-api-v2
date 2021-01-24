"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userBillMutations = void 0;
const graphql_1 = require("graphql");
const graphql_iso_date_1 = require("graphql-iso-date");
const type_1 = require("./type");
const _services_1 = require("@services");
exports.userBillMutations = {
    addUserBill: {
        type: type_1.UserBill,
        args: {
            user_id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
            bill_id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
            created_at: { type: graphql_iso_date_1.GraphQLDateTime },
        },
        resolve: (_parent, args, _context, _resolveInfo) => new _services_1.UsersService().gqlCreateUserBill({
            userId: args.userId,
            billId: args.bill_id,
        }),
    },
    deleteUserBill: {
        type: type_1.UserBill,
        args: {
            user_id: { type: graphql_1.GraphQLInt },
            bill_id: { type: graphql_1.GraphQLInt },
        },
        resolve: (_parent, args, _context, _resolveInfo) => __awaiter(void 0, void 0, void 0, function* () {
            return new _services_1.UsersService().gqlDeleteUserBill({
                userId: args.userId,
                billId: args.bill_id,
            });
        }),
    },
};
