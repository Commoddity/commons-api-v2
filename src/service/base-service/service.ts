import { db, pgp } from "@db";
import { QueryUtils } from ".";

export class BaseService<T> {
  /* Create methods */
  async createOne<T>({ table, tableValues }: CreateParams<T>): Promise<T> {
    const query: string = QueryUtils.createInsertQuery(tableValues, table);

    console.log("QUERY IS HERE", query);

    try {
      return this.one<T>(query);
    } catch (error) {
      throw new Error(`[ROW CREATION ERROR]: ${error}`);
    }
  }

  async createMany({
    table,
    tableValuesArray,
  }: CreateManyParams<T>): Promise<T[]> {
    const query: string = QueryUtils.createInsertQuery(tableValuesArray, table);

    try {
      return this.many<T>(query);
    } catch (error) {
      throw new Error(`[MULTIPLE ROW CREATION ERROR]: ${error}`);
    }
  }

  async createJoinTable({
    idOne,
    idTwo,
    table,
  }: CreateJoinParams): Promise<boolean> {
    const query: string = QueryUtils.createJoinQuery(idOne, idTwo, table);

    try {
      this.one(query);
      return true;
    } catch (error) {
      throw new Error(`[JOIN TABLE CREATION ERROR]: ${error}`);
    }
  }

  async deleteJoinTable({
    idOne,
    idTwo,
    table,
  }: CreateJoinParams): Promise<boolean> {
    const query: string = QueryUtils.createJoinDeleteQuery(idOne, idTwo, table);

    try {
      this.none(query);
      return true;
    } catch (error) {
      throw new Error(`[JOIN TABLE DELETION ERROR]: ${error}`);
    }
  }

  async createJoinTables<T>({
    table,
    tableValuesArray,
  }: CreateManyParams<T>): Promise<T[]> {
    const query: string = QueryUtils.createInsertQuery(tableValuesArray, table);

    try {
      return this.many<T>(query);
    } catch (error) {
      throw new Error(`[MULTIPLE JOIN TABLE CREATION ERROR]: ${error}`);
    }
  }

  /* Read methods */
  async findOne<T>({ table, where }: ReadParams): Promise<T> {
    const whereClause = QueryUtils.createWhereClause(where);
    const query = QueryUtils.createSelectQuery(table, whereClause);

    try {
      return this.one<T>(query);
    } catch (error) {
      throw new Error(`[FIND ONE ERROR]: ${error}`);
    }
  }

  async findMany<T>({ table, where, operator }: WhereParams): Promise<T[]> {
    const whereClause = QueryUtils.createWhereClause(where, operator);

    const query = QueryUtils.createSelectQuery(table, whereClause, true);

    try {
      return this.many<T>(query);
    } catch (error) {
      throw new Error(`[FIND MANY ERROR]: ${error}`);
    }
  }

  async findAll(table: string): Promise<T[]> {
    const query = pgp.as.format("SELECT * FROM $1:raw", [table]);

    try {
      return await this.many<T>(query);
    } catch (error) {
      throw new Error(`[FIND MANY ERROR]: ${error}`);
    }
  }

  async findLatestId({ table }: TableParams): Promise<string> {
    const query = pgp.as.format(
      "SELECT id FROM $1:raw ORDER BY id DESC LIMIT 1",
      [table],
    );

    try {
      return String((await this.one<{ id: number }>(query)).id);
    } catch (error) {
      throw new Error(`[FIND LATEST ID ERROR]: ${error}`);
    }
  }

  async findOneId({ table, where }: ReadParams): Promise<string> {
    const whereClause = QueryUtils.createWhereClause(where);
    const query = pgp.as.format("SELECT id FROM $1:raw $2:raw", [
      table,
      whereClause,
    ]);

    try {
      return this.one<string>(query);
    } catch (error) {
      throw new Error(`[FIND LATEST ID ERROR]: ${error}`);
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
      return (await this.many<any>(query)).map((row) => row[column]);
    } catch (error) {
      throw new Error(`[FIND LATEST ID ERROR]: ${error}`);
    }
  }

  async findIfRowExists({ table, where }: ReadParams): Promise<boolean> {
    const whereClause = QueryUtils.createWhereClause(where);
    const query = pgp.as.format("SELECT EXISTS(SELECT 1 FROM $1:raw $2:raw)", [
      table,
      whereClause,
    ]);

    try {
      return (await this.one<{ exists: boolean }>(query)).exists;
    } catch (error) {
      throw new Error(`[FIND ROW EXISTS ERROR]: ${error}`);
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

      return this.one<boolean>(query);
    } catch (error) {
      throw new Error(`[FIND ROW CONTAINS ERROR]: ${error}`);
    }
  }

  /* Update methods */
  async updateOne({ table, data }: UpdateOneParams): Promise<T> {
    try {
      const query = QueryUtils.createUpdateQuery({
        table,
        data,
      });

      return this.one<T>(query);
    } catch (error) {
      throw new Error(`[UPDATE ONE ROW ERROR]: ${error}`);
    }
  }

  async updateMany({ table, data }: UpdateManyParams): Promise<T[]> {
    try {
      const query = QueryUtils.createUpdateQuery({
        table,
        data,
      });

      return this.many<T>(query);
    } catch (error) {
      throw new Error(`[UPDATE MANY ROW ERROR]: ${error}`);
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
      await this.none(query);
      return true;
    } catch (error) {
      throw new Error(`[ROW DELETION ERROR]: ${error}`);
    }
  }

  async one<T>(query: string): Promise<T> {
    return await db.one<T>(query);
  }

  async many<T>(query: string): Promise<T[]> {
    return await db.any<T>(query);
  }

  async none(query: string): Promise<null> {
    return await db.none(query);
  }
}
