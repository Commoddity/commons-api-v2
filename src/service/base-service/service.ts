import { db } from "@config";
import { CreateManyParams, CreateParams, UpdateParams, Value } from "@types";

export class BaseService<T> {
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

  async findLatestId({
    table,
  }: {
    table: string;
  }): Promise<string | undefined> {
    try {
      const query = `SELECT id FROM ${table} ORDER BY id DESC LIMIT 1`;
      const [sessionQueryResult] = await db.query(query);
      return sessionQueryResult.id;
    } catch (err) {
      console.error(`[FIND ONE QUERY ERROR]: ${err}`);
      return;
    }
  }

  async findIfRowExists({
    table,
    column,
    value,
  }): Promise<boolean | undefined> {
    try {
      const query = `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column}='${value}')`;
      const [rowQueryResult] = await db.query(query);
      return rowQueryResult.exists;
    } catch (err) {
      console.error(
        `An error occurred while querying whether value exists: ${err}`,
      );
    }
  }

  async findIfRowContains({
    table,
    column,
    value,
  }): Promise<boolean | undefined> {
    try {
      const query = `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column} LIKE '%${value}%')`;
      const [rowQueryResult] = await db.query(query);
      return rowQueryResult.exists;
    } catch (err) {
      console.error(
        `An error occurred while querying whether value exists: ${err}`,
      );
    }
  }

  async updateOne({
    table,
    column,
    value,
    whereColumn,
    whereValue,
  }: UpdateParams): Promise<boolean> {
    try {
      const query = `UPDATE ${table} SET ${column} = '${value}' WHERE ${whereColumn} = '${whereValue}'`;
      await db.query(query);
      return true;
    } catch (err) {
      console.error(`An error occurred while updating row: ${err}`);
      return false;
    }
  }

  private createColumns(tableValues: T | T[]) {
    let exampleRow: string[];

    if (Array.isArray(tableValues)) {
      exampleRow = Object.keys(tableValues[0]);
    } else {
      exampleRow = Object.keys(tableValues);
    }

    const addComma = (i: number, a: string[]): string =>
      i !== a.length - 1 ? `, ` : ``;

    return exampleRow.reduce<string>(
      (columnsString: string, nextString: string, i: number, a: string[]) =>
        columnsString.concat(`${nextString}${addComma(i, a)}`),
      "",
    );
  }
}
