import { db } from "@config";
import {
  CreateManyParams,
  CreateParams,
  QueryParams,
  ReadParams,
  TableParams,
  Value,
  WhereCondition,
  WhereParams,
} from "@types";

import { BillCategory } from "../bills";

export class BaseService<T> {
  /* Create methods */
  async createOne({
    table,
    tableValues,
  }: CreateParams<T>): Promise<T | undefined> {
    let row: T;

    const columns: string = this.createColumns(tableValues);
    const values: Value[] = Object.values(tableValues);

    const query: string = `
    INSERT INTO ${table} (${columns}) VALUES ?
    RETURNING *`;

    try {
      const createdRow = await db.query<T>(query, values);

      if (createdRow) {
        row = createdRow;
        return row;
      }
    } catch (err) {
      console.error(`[ROW CREATION ERROR]: ${err}`);
      return;
    }
  }

  async createMany({
    table,
    tableValuesArray,
  }: CreateManyParams<T>): Promise<T[] | undefined> {
    let rows: T[] = [];

    const columns: string = this.createColumns(tableValuesArray);
    const values: Value[][] = [];
    tableValuesArray.forEach((table: T) => {
      const rowValues: Value[] = Object.values(table);
      values.push(rowValues);
    });

    const query: string = `
    INSERT INTO ${table} (${columns}) VALUES ?
    RETURNING *`;

    try {
      const createdRows = await db.query<T[]>(query, [values]);

      if (createdRows) {
        rows = createdRows;
        return rows;
      }
    } catch (err) {
      console.error(`[MULTIPLE ROW CREATION ERROR]: ${err}`);
      return;
    }
  }

  async createJoinTables({
    table,
    tableValuesArray,
  }: CreateManyParams<BillCategory>): Promise<BillCategory[] | undefined> {
    let rows: BillCategory[] = [];

    const columns: string = this.createColumns(tableValuesArray);
    const values: Value[][] = [];
    tableValuesArray.forEach((table: BillCategory) => {
      const rowValues: Value[] = Object.values(table);
      values.push(rowValues);
    });

    const query: string = `
    INSERT INTO ${table} (${columns}) VALUES ?
    RETURNING *`;

    try {
      const createdRows = await db.query<BillCategory[]>(query, [values]);

      if (createdRows) {
        rows = createdRows;
        return rows;
      }
    } catch (err) {
      console.error(`[MULTIPLE ROW CREATION ERROR]: ${err}`);
      return;
    }
  }

  /* Read methods */
  async findOne({ table, where }: ReadParams): Promise<T> {
    const queryString = `SELECT * FROM ${table} LIMIT 1`;
    const whereClause = this.createWhereClause(where);

    return await db.query<T[]>(queryString.concat(whereClause))[0];
  }

  async findMany({ table, where }: WhereParams): Promise<T[]> {
    const queryString = `SELECT * FROM ${table}`;
    const whereClause = this.createWhereClause(where);

    return await db.query<T[]>(queryString.concat(whereClause));
  }

  async findLatestId({ table }: TableParams): Promise<string | undefined> {
    try {
      const query = `SELECT id FROM ${table} ORDER BY id DESC LIMIT 1`;

      const [sessionQueryResult] = await db.query(query);
      return sessionQueryResult.id;
    } catch (err) {
      console.error(`[FIND LATEST ID ERROR]: ${err}`);
      return;
    }
  }

  async findIfRowExists({
    table,
    where,
  }: WhereParams): Promise<boolean | undefined> {
    try {
      const query = `SELECT EXISTS(SELECT 1 FROM ${table}`;
      const whereClause = this.createWhereClause(where);

      const [rowQueryResult] = await db.query<T[]>(
        query.concat(`${whereClause})`),
      );
      return !!rowQueryResult;
    } catch (err) {
      console.error(`[FIND ROW EXISTS ERROR]: ${err}`);
    }
  }

  async findIfRowContains({
    table,
    column,
    value,
  }: QueryParams): Promise<boolean | undefined> {
    try {
      const query = `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column} LIKE '%${value}%')`;

      const [rowQueryResult] = await db.query<T[]>(query);
      return !!rowQueryResult;
    } catch (err) {
      console.error(`[FIND ROW CONTAINS ERROR]: ${err}`);
    }
  }

  /* Update methods */
  async updateOne({
    table,
    column,
    value,
    where,
  }: WhereParams): Promise<T | undefined> {
    try {
      const query = `UPDATE ${table} SET ${column} = '${value}'
                    RETURNING *`;
      const whereClause = this.createWhereClause(where);

      return await db.query<T>(query.concat(whereClause));
    } catch (err) {
      console.error(`[UPDATE ONE ROW ERROR]: ${err}`);
      return undefined;
    }
  }

  /* Delete methods */

  /* Query String creation methods */
  private createColumns(tableValues: any | any[]): string {
    let exampleRow: string[];

    if (Array.isArray(tableValues)) {
      exampleRow = Object.keys(tableValues[0]);
    } else {
      exampleRow = Object.keys(tableValues);
    }

    const addComma = (index: number, arr: string[]): string =>
      index !== arr.length - 1 ? `, ` : ``;

    return exampleRow.reduce<string>(
      (columnsString, nextString, index, arr) =>
        columnsString.concat(`${nextString}${addComma(index, arr)}`),
      "",
    );
  }

  private createWhereClause(
    whereClause: WhereCondition | WhereCondition[],
    operator: "AND" | "OR" = "AND",
  ): string {
    if (Array.isArray(whereClause)) {
      return whereClause.reduce<string>((whereString, condition, index) => {
        return whereString.concat(
          `${index === 0 ? " WHERE" : ` ${operator}`} ${condition.column}='${
            condition.value
          }'`,
        );
      }, "");
    } else {
      return ` WHERE ${whereClause.column}='${whereClause.value}'`;
    }
  }
}
