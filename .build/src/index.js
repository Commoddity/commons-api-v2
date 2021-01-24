"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const dotenvPath = path_1.default.join(__dirname, "../", `.env.${process.env.NODE_ENV}`);
dotenv_1.default.config({
    path: dotenvPath,
});
const apollo_server_lambda_1 = require("apollo-server-lambda");
const db_1 = require("./db");
const server = new apollo_server_lambda_1.ApolloServer({
    schema: db_1.schema,
    playground: {
        endpoint: "/dev/graphql",
    },
});
exports.graphqlHandler = server.createHandler();
