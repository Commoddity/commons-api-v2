"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateScalar = void 0;
const graphql_1 = require("graphql");
const dayjs_1 = __importDefault(require("dayjs"));
const isDate = (dateString) => {
    return !isNaN(new Date(dateString).getDate());
};
const dateOrUndefinedSerialize = (value) => {
    if (isDate(value)) {
        return dayjs_1.default(value).format(`YYYY/MM/DD`);
    }
    else if (value === "undefined") {
        return undefined;
    }
    else {
        throw new Error("Date scalar must be a valid date string or undefined.");
    }
};
const dateOrUndefinedParseValue = (value) => {
    if (isDate(value)) {
        return dayjs_1.default(value).format(`YYYY/MM/DD`);
    }
    else if (value === "undefined") {
        return undefined;
    }
    else {
        throw new Error("Date scalar must be a valid date string or undefined.");
    }
};
const dateOrUndefinedParseLiteral = (ast) => {
    const { value } = ast;
    if (isDate(value)) {
        return dayjs_1.default(value).format(`YYYY/MM/DD`);
    }
    else if (value === "undefined") {
        return undefined;
    }
    else {
        throw new Error("Date scalar must be a valid date string or undefined.");
    }
};
exports.DateScalar = new graphql_1.GraphQLScalarType({
    name: "Date",
    description: "A Date string or undefined",
    serialize: dateOrUndefinedSerialize,
    parseValue: dateOrUndefinedParseValue,
    parseLiteral: dateOrUndefinedParseLiteral,
});
