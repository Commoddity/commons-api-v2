import { db, pgp } from "@config";
import {
  CreateManyParams,
  CreateParams,
  QueryParams,
  ReadParams,
  TableParams,
  WhereCondition,
  WhereParams,
} from "@types";

import { BillCategory } from "../bills";

export class BaseService<T> {
  /* Create methods */
  async createOne({ table, tableValues }: CreateParams<T>): Promise<T> {
    const query: string = this.createInsertQuery(tableValues, table);

    try {
      return await db.one<T>(query);
    } catch (err) {
      throw new Error(`[ROW CREATION ERROR]: ${err}`);
    }
  }

  async createMany({
    table,
    tableValuesArray,
  }: CreateManyParams<T>): Promise<T[]> {
    const query: string = this.createInsertQuery(tableValuesArray, table);

    try {
      return await db.any<T>(query);
    } catch (err) {
      throw new Error(`[MULTIPLE ROW CREATION ERROR]: ${err}`);
    }
  }

  async createJoinTables({
    table,
    tableValuesArray,
  }: CreateManyParams<BillCategory>): Promise<BillCategory[]> {
    const query: string = this.createInsertQuery(tableValuesArray, table);

    try {
      return await db.any<BillCategory>(query);
    } catch (err) {
      throw new Error(`[JOIN TABLE CREATION ERROR]: ${err}`);
    }
  }

  /* Read methods */
  async findOne({ table, whereClause }: ReadParams): Promise<T> {
    const where = this.createWhereClause(whereClause);
    const query = this.createSelectQuery(table, where);

    try {
      return await db.one<T>(query);
    } catch (err) {
      throw new Error(`[FIND ONE ERROR]: ${err}`);
    }
  }

  async findMany({ table, whereClause }: WhereParams): Promise<T[]> {
    const where = this.createWhereClause(whereClause);
    const query = this.createSelectQuery(table, where, true);

    try {
      return await db.any<T>(query);
    } catch (err) {
      throw new Error(`[FIND MANY ERROR]: ${err}`);
    }
  }

  async findLatestId({ table }: TableParams): Promise<string> {
    const query = pgp.as.format(
      "SELECT id FROM $1:raw ORDER BY id DESC LIMIT 1",
      [table],
    );

    try {
      return (await db.one<{ id: string }>(query)).id;
    } catch (err) {
      throw new Error(`[FIND LATEST ID ERROR]: ${err}`);
    }
  }

  async findIfRowExists({ table, whereClause }: ReadParams): Promise<boolean> {
    const where = this.createWhereClause(whereClause);
    const query = pgp.as.format("SELECT EXISTS(SELECT 1 FROM $1:raw $2:raw", [
      table,
      where,
    ]);

    try {
      return await db.one<boolean>(query);
    } catch (err) {
      throw new Error(`[FIND ROW EXISTS ERROR]: ${err}`);
    }
  }

  async findIfRowContains({
    table,
    column,
    value,
  }: QueryParams): Promise<boolean> {
    try {
      const query = pgp.as.format(
        `SELECT EXISTS(SELECT 1 FROM $1:raw WHERE $2:raw LIKE '%$3:raw%')`,
        [table, column, value],
      );

      return await db.one<boolean>(query);
    } catch (err) {
      throw new Error(`[FIND ROW CONTAINS ERROR]: ${err}`);
    }
  }

  /* Update methods */
  async updateOne({
    table,
    column,
    value,
    whereClause,
  }: WhereParams): Promise<T> {
    try {
      const query = this.createSingleUpdateQuery({
        table,
        column,
        value,
        whereClause,
      });

      return await db.one<T>(query);
    } catch (err) {
      throw new Error(`[UPDATE ONE ROW ERROR]: ${err}`);
    }
  }

  /* Delete methods */

  /* Query String creation methods */
  private createInsertQuery(tableValues: any | any[], table: string): string {
    let exampleRow: string[];

    if (Array.isArray(tableValues)) {
      exampleRow = Object.keys(tableValues[0]);
    } else {
      exampleRow = Object.keys(tableValues);
    }

    const columnSet = new pgp.helpers.ColumnSet(exampleRow, { table });

    return pgp.helpers.insert(tableValues, columnSet);
  }

  private createSelectQuery(
    table: string,
    where: string,
    multiple: boolean = false,
  ): string {
    const baseQuery = multiple
      ? "SELECT * FROM $1:raw $2:raw"
      : "SELECT * FROM $1:raw LIMIT 1 $2:raw";
    return pgp.as.format(baseQuery, [table, where]);
  }

  private createSingleUpdateQuery({
    table,
    column,
    value,
    whereClause,
  }): string {
    const dataSingle = {
      [whereClause.column]: whereClause.value,
      [column]: value,
    };
    const where = this.createWhereClause(whereClause);

    return pgp.helpers.update(dataSingle, [column], table) + where;
  }

  private createWhereClause(
    whereClause: WhereCondition | WhereCondition[],
    operator: "AND" | "OR" = "AND",
  ): string {
    let query: string;
    let values: string[] = [];

    if (Array.isArray(whereClause)) {
      query = whereClause.reduce<string>((whereString, { column }, index) => {
        return whereString.concat(
          `${index === 0 ? " WHERE" : ` ${operator}`} ${column}=$${index + 1}`,
        );
      }, "");
      values = whereClause.map(({ value }) => value);
    } else {
      query = ` WHERE ${whereClause.column}=$1`;
      values = [whereClause.value];
    }

    return pgp.as.format(query, values);
  }
}
