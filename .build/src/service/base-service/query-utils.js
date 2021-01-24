"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryUtils = void 0;
const _db_1 = require("@db");
class QueryUtils {
    static createDeleteQuery(table, where, operator) {
        const whereClause = this.createWhereClause(where, operator);
        const baseQuery = "DELETE FROM $1:raw" + whereClause;
        return _db_1.pgp.as.format(baseQuery, [table]);
    }
    static createInsertQuery(tableValues, table) {
        let exampleRow;
        if (Array.isArray(tableValues)) {
            exampleRow = Object.keys(tableValues[0]);
        }
        else {
            exampleRow = Object.keys(tableValues);
        }
        const columnSet = new _db_1.pgp.helpers.ColumnSet(exampleRow, { table });
        return _db_1.pgp.helpers.insert(tableValues, columnSet) + " RETURNING *";
    }
    static createJoinQuery(idOne, idTwo, table) {
        const [[columnOne, valueOne]] = Object.entries(idOne);
        const [[columnTwo, valueTwo]] = Object.entries(idTwo);
        const query = `INSERT INTO ${table} (${columnOne}, ${columnTwo}) 
    VALUES ($1:raw, $2:raw)`;
        const values = [valueOne, valueTwo];
        return _db_1.pgp.as.format(query, values) + " RETURNING *";
    }
    static createJoinDeleteQuery(idOne, idTwo, table) {
        const [[columnOne, valueOne]] = Object.entries(idOne);
        const [[columnTwo, valueTwo]] = Object.entries(idTwo);
        const query = `DELETE FROM ${table} 
                  WHERE (${columnOne} = $1:raw) AND (${columnTwo} = $2:raw)`;
        const values = [valueOne, valueTwo];
        return _db_1.pgp.as.format(query, values);
    }
    static createSelectQuery(table, where, multiple = false) {
        const baseQuery = multiple
            ? "SELECT * FROM $1:raw $2:raw"
            : "SELECT * FROM $1:raw $2:raw LIMIT 1";
        return _db_1.pgp.as.format(baseQuery, [table, where]);
    }
    static createUpdateQuery({ table, data }) {
        if (Array.isArray(data)) {
            const columns = Object.keys(data[0]);
            const where = ` WHERE v.${columns[0]} = t.${columns[0]}`;
            columns[0] = "?" + columns[0];
            const columnSet = new _db_1.pgp.helpers.ColumnSet(columns, { table });
            return _db_1.pgp.helpers.update(data, columnSet) + where + " RETURNING *";
        }
        else {
            const columns = Object.keys(data).slice(1);
            const whereCondition = Object.entries(data)[0];
            const where = { [whereCondition[0]]: whereCondition[1] };
            const whereClause = this.createWhereClause(where);
            return (_db_1.pgp.helpers.update(data, columns, table) + whereClause + " RETURNING *");
        }
    }
    static createWhereClause(where, operator = "AND") {
        let query;
        let values = [];
        if (Array.isArray(where)) {
            query = where.reduce((whereString, whereClause, index) => {
                const [pairs] = Object.entries(whereClause);
                return whereString.concat(`${index === 0 ? " WHERE" : ` ${operator}`} ${pairs[0]}=$${index + 1}`);
            }, "");
            values = where.map((item) => {
                const [pairs] = Object.entries(item);
                return pairs[1];
            });
        }
        else {
            const [[column, value]] = Object.entries(where);
            query = ` WHERE ${column}=$1`;
            values = [value];
        }
        return _db_1.pgp.as.format(query, values);
    }
    static createGraphQLWhereClause(table, args) {
        const whereClause = [];
        const values = [];
        Object.entries(args).forEach(([arg, value], index) => {
            whereClause.push(`${table}.${arg}=$${index + 1}`);
            values.push(value);
        });
        return _db_1.pgp.as.format(whereClause.join(" AND "), values);
    }
    static createWhereClauseFromArray(where) {
        const [[column, arrayValue]] = Object.entries(where);
        return _db_1.pgp.as.format(`WHERE ${column}=ANY(ARRAY[$1:raw])`, [arrayValue]);
    }
}
exports.QueryUtils = QueryUtils;
