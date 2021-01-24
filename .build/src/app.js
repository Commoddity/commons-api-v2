"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const dotenvPath = path_1.default.join(__dirname, "../", `.env.${process.env.NODE_ENV}`);
dotenv_1.default.config({
    path: dotenvPath,
});
const cors_1 = __importDefault(require("cors"));
const _db_1 = require("@db");
const corsOptions = {
    origin: process.env.COMMONS_FRONT_END,
    credentials: true,
};
const app = express_1.default();
exports.app = app;
app.use(cors_1.default(corsOptions));
app.use(body_parser_1.default.json());
app.use("/api", express_graphql_1.graphqlHTTP({
    schema: _db_1.schema,
    graphiql: true,
}));
