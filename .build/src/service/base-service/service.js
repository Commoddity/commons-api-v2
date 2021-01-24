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
exports.BaseService = void 0;
const _db_1 = require("@db");
const _1 = require(".");
class BaseService {
    constructor() {
        this.db = _db_1.db;
    }
    createOne({ table, tableValues }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = _1.QueryUtils.createInsertQuery(tableValues, table);
            try {
                return this.one(query);
            }
            catch (error) {
                throw new Error(`[ROW CREATION ERROR]: ${error}`);
            }
        });
    }
    createMany({ table, tableValuesArray, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = _1.QueryUtils.createInsertQuery(tableValuesArray, table);
            try {
                return this.many(query);
            }
            catch (error) {
                throw new Error(`[MULTIPLE ROW CREATION ERROR]: ${error}`);
            }
        });
    }
    createJoinTable({ idOne, idTwo, table, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = _1.QueryUtils.createJoinQuery(idOne, idTwo, table);
            try {
                this.one(query);
                return true;
            }
            catch (error) {
                throw new Error(`[JOIN TABLE CREATION ERROR]: ${error}`);
            }
        });
    }
    deleteJoinTable({ idOne, idTwo, table, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = _1.QueryUtils.createJoinDeleteQuery(idOne, idTwo, table);
            try {
                this.none(query);
                return true;
            }
            catch (error) {
                throw new Error(`[JOIN TABLE DELETION ERROR]: ${error}`);
            }
        });
    }
    createJoinTables({ table, tableValuesArray, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = _1.QueryUtils.createInsertQuery(tableValuesArray, table);
            try {
                return this.many(query);
            }
            catch (error) {
                throw new Error(`[MULTIPLE JOIN TABLE CREATION ERROR]: ${error}`);
            }
        });
    }
    findOne({ table, where }) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereClause = _1.QueryUtils.createWhereClause(where);
            const query = _1.QueryUtils.createSelectQuery(table, whereClause);
            try {
                return this.one(query);
            }
            catch (error) {
                throw new Error(`[FIND ONE ERROR]: ${error}`);
            }
        });
    }
    findMany({ table, where, operator }) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereClause = _1.QueryUtils.createWhereClause(where, operator);
            const query = _1.QueryUtils.createSelectQuery(table, whereClause, true);
            try {
                return this.many(query);
            }
            catch (error) {
                throw new Error(`[FIND MANY ERROR]: ${error}`);
            }
        });
    }
    findAll(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = _db_1.pgp.as.format("SELECT * FROM $1:raw", [table]);
            try {
                return yield this.many(query);
            }
            catch (error) {
                throw new Error(`[FIND MANY ERROR]: ${error}`);
            }
        });
    }
    findLatestId({ table }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = _db_1.pgp.as.format("SELECT id FROM $1:raw ORDER BY id DESC LIMIT 1", [table]);
            try {
                return String((yield this.one(query)).id);
            }
            catch (error) {
                throw new Error(`[FIND LATEST ID ERROR]: ${error}`);
            }
        });
    }
    findOneId({ table, where }) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereClause = _1.QueryUtils.createWhereClause(where);
            const query = _db_1.pgp.as.format("SELECT id FROM $1:raw $2:raw", [
                table,
                whereClause,
            ]);
            try {
                return this.one(query);
            }
            catch (error) {
                throw new Error(`[FIND LATEST ID ERROR]: ${error}`);
            }
        });
    }
    findAllValues({ table, column, sort = false, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = sort
                ? _db_1.pgp.as.format("SELECT $1:raw FROM $2:raw ORDER BY $1:raw", [
                    column,
                    table,
                ])
                : _db_1.pgp.as.format("SELECT $1:raw FROM $2:raw", [column, table]);
            try {
                return (yield this.many(query)).map((row) => row[column]);
            }
            catch (error) {
                throw new Error(`[FIND LATEST ID ERROR]: ${error}`);
            }
        });
    }
    findIfRowExists({ table, where }) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereClause = _1.QueryUtils.createWhereClause(where);
            const query = _db_1.pgp.as.format("SELECT EXISTS(SELECT 1 FROM $1:raw $2:raw)", [
                table,
                whereClause,
            ]);
            try {
                return (yield this.one(query)).exists;
            }
            catch (error) {
                throw new Error(`[FIND ROW EXISTS ERROR]: ${error}`);
            }
        });
    }
    findIfRowContains({ table, column, value, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = _db_1.pgp.as.format(`SELECT EXISTS(SELECT 1 FROM $1:raw WHERE $2:raw LIKE '%$3:raw%')`, [table, column, value]);
                return this.one(query);
            }
            catch (error) {
                throw new Error(`[FIND ROW CONTAINS ERROR]: ${error}`);
            }
        });
    }
    updateOne({ table, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = _1.QueryUtils.createUpdateQuery({
                    table,
                    data,
                });
                return this.one(query);
            }
            catch (error) {
                throw new Error(`[UPDATE ONE ROW ERROR]: ${error}`);
            }
        });
    }
    updateMany({ table, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = _1.QueryUtils.createUpdateQuery({
                    table,
                    data,
                });
                return this.many(query);
            }
            catch (error) {
                throw new Error(`[UPDATE MANY ROW ERROR]: ${error}`);
            }
        });
    }
    deleteOne({ table, where, operator = undefined, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = _1.QueryUtils.createDeleteQuery(table, where, operator);
            try {
                yield this.none(query);
                return true;
            }
            catch (error) {
                throw new Error(`[ROW DELETION ERROR]: ${error}`);
            }
        });
    }
    one(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.one(query);
        });
    }
    many(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.any(query);
        });
    }
    none(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.none(query);
        });
    }
}
exports.BaseService = BaseService;
