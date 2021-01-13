import { db, pgp, QueryUtils } from "@db";

export class BaseService<T> {
  /* Create methods */
  async createOne({ table, tableValues }: CreateParams<T>): Promise<T> {
    const query: string = QueryUtils.createInsertQuery(tableValues, table);

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
    const query: string = QueryUtils.createInsertQuery(tableValuesArray, table);

    try {
      return await db.any<T>(query);
    } catch (err) {
      throw new Error(`[MULTIPLE ROW CREATION ERROR]: ${err}`);
    }
  }

  async createJoinTables<T>({
    table,
    tableValuesArray,
  }: CreateManyParams<T>): Promise<T[]> {
    const query: string = QueryUtils.createInsertQuery(tableValuesArray, table);

    try {
      return await db.any<T>(query);
    } catch (err) {
      throw new Error(`[JOIN TABLE CREATION ERROR]: ${err}`);
    }
  }

  /* Read methods */
  async findOne({ table, where }: ReadParams): Promise<T> {
    const whereClause = QueryUtils.createWhereClause(where);
    const query = QueryUtils.createSelectQuery(table, whereClause);

    try {
      return await db.one<T>(query);
    } catch (err) {
      throw new Error(`[FIND ONE ERROR]: ${err}`);
    }
  }

  async findMany({
    table,
    where,
    arraySearch = true,
  }: WhereParams): Promise<T[]> {
    let whereClause: string;
    if (arraySearch) {
      whereClause = QueryUtils.createWhereClauseFromArray(where);
    } else {
      whereClause = QueryUtils.createWhereClause(where);
    }

    const query = QueryUtils.createSelectQuery(table, whereClause, true);

    try {
      return await db.any<T>(query);
    } catch (err) {
      throw new Error(`[FIND MANY ERROR]: ${err}`);
    }
  }

  async findAll(table: string): Promise<T[]> {
    const query = pgp.as.format("SELECT * FROM $1:raw", [table]);

    try {
      return await db.any<T>(query);
    } catch (err) {
      throw new Error(`[FIND MANY ERROR]: ${err}`);
    }
  }

  async findLatestId({ table }: TableParams): Promise<number> {
    const query = pgp.as.format(
      "SELECT id FROM $1:raw ORDER BY id DESC LIMIT 1",
      [table],
    );

    try {
      return Number((await db.one<{ id: number }>(query)).id);
    } catch (err) {
      throw new Error(`[FIND LATEST ID ERROR]: ${err}`);
    }
  }

  async findAllValues({
    table,
    column,
    sort = false,
  }: FindAllValuesParams): Promise<any[]> {
    const query = sort
      ? pgp.as.format("SELECT $1:raw FROM $2:raw ORDER BY $1:raw", [
          column,
          table,
        ])
      : pgp.as.format("SELECT $1:raw FROM $2:raw", [column, table]);

    try {
      const returnedValues = (await db.any<any>(query)).map(
        (row) => row[column],
      );
      return sort ? returnedValues.sort() : returnedValues;
    } catch (err) {
      throw new Error(`[FIND LATEST ID ERROR]: ${err}`);
    }
  }

  async findIfRowExists({ table, where }: ReadParams): Promise<boolean> {
    const whereClause = QueryUtils.createWhereClause(where);
    const query = pgp.as.format("SELECT EXISTS(SELECT 1 FROM $1:raw $2:raw", [
      table,
      whereClause,
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
  async updateOne({ table, data }: UpdateOneParams): Promise<T> {
    try {
      const query = QueryUtils.createUpdateQuery({
        table,
        data,
      });

      return await db.one<T>(query);
    } catch (err) {
      throw new Error(`[UPDATE ONE ROW ERROR]: ${err}`);
    }
  }

  async updateMany({ table, data }: UpdateManyParams): Promise<T[]> {
    try {
      const query = QueryUtils.createUpdateQuery({
        table,
        data,
      });

      return await db.any<T>(query);
    } catch (err) {
      throw new Error(`[UPDATE MANY ROW ERROR]: ${err}`);
    }
  }

  /* Delete methods */
  async deleteOne({
    table,
    where,
    operator = undefined,
  }: DeleteParams): Promise<boolean> {
    const query: string = QueryUtils.createDeleteQuery(table, where, operator);

    try {
      await db.none(query);
      return true;
    } catch (err) {
      throw new Error(`[ROW DELETION ERROR]: ${err}`);
    }
  }
}
