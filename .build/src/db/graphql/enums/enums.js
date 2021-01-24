"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationEnumType = void 0;
const graphql_1 = require("graphql");
exports.NotificationEnumType = new graphql_1.GraphQLEnumType({
    name: "NotificationEnum",
    values: {
        DAILY: {
            value: 0,
        },
        WEEKLY: {
            value: 1,
        },
        BIWEEKLY: {
            value: 2,
        },
        MONTHLY: {
            value: 3,
        },
    },
});
