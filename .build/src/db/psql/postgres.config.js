"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = exports.pgp = exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const dotenvPath = path_1.default.join(__dirname, "../", `.env.${process.env.NODE_ENV}`);
dotenv_1.default.config({
    path: dotenvPath,
});
const pg_promise_1 = __importDefault(require("pg-promise"));
const path_2 = require("path");
const pgp = pg_promise_1.default({
    capSQL: true,
});
exports.pgp = pgp;
const devConfig = {
    host: String(process.env.POSTGRES_HOST),
    port: Number(process.env.POSTGRES_PORT),
    database: String(process.env.POSTGRES_DB),
    user: String(process.env.POSTGRES_USER),
    password: String(process.env.POSTGRES_PASSWORD),
};
const db = pgp(devConfig);
exports.db = db;
const sql = (file) => {
    const fullPath = path_2.join(__dirname, file);
    return new pgp.QueryFile(fullPath, { minify: true });
};
exports.sql = sql;
