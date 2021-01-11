import { db, pgp } from "@config";

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

  async createJoinTables<T>({
    table,
    tableValuesArray,
  }: CreateManyParams<T>): Promise<T[]> {
    const query: string = this.createInsertQuery(tableValuesArray, table);

    try {
      return await db.any<T>(query);
    } catch (err) {
      throw new Error(`[JOIN TABLE CREATION ERROR]: ${err}`);
    }
  }

  /* Read methods */
  async findOne({ table, where }: ReadParams): Promise<T> {
    const whereClause = this.createWhereClause(where);
    const query = this.createSelectQuery(table, whereClause);

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
      whereClause = this.createWhereClauseFromArray(where);
    } else {
      whereClause = this.createWhereClause(where);
    }

    const query = this.createSelectQuery(table, whereClause, true);

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
    const whereClause = this.createWhereClause(where);
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
      const query = this.createUpdateQuery({
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
      const query = this.createUpdateQuery({
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
    const query: string = this.createDeleteQuery(table, where, operator);

    try {
      await db.none(query);
      return true;
    } catch (err) {
      throw new Error(`[ROW DELETION ERROR]: ${err}`);
    }
  }

  /* Query String creation methods */
  private createDeleteQuery(
    table: string,
    where: WhereCondition | WhereCondition[],
    operator?: "AND" | "OR",
  ): string {
    const whereClause = this.createWhereClause(where, operator);
    const baseQuery = "DELETE FROM $1:raw" + whereClause;

    return pgp.as.format(baseQuery, [table]);
  }

  private createInsertQuery(tableValues: any | any[], table: string): string {
    let exampleRow: string[];

    if (Array.isArray(tableValues)) {
      exampleRow = Object.keys(tableValues[0]);
    } else {
      exampleRow = Object.keys(tableValues);
    }

    const columnSet = new pgp.helpers.ColumnSet(exampleRow, { table });

    return pgp.helpers.insert(tableValues, columnSet) + " RETURNING *";
  }

  private createSelectQuery(
    table: string,
    where: string,
    multiple = false,
  ): string {
    const baseQuery = multiple
      ? "SELECT * FROM $1:raw $2:raw"
      : "SELECT * FROM $1:raw $2:raw LIMIT 1";

    return pgp.as.format(baseQuery, [table, where]);
  }

  private createUpdateQuery({ table, data }: UpdateQueryParams): string {
    if (Array.isArray(data)) {
      const columns = Object.keys(data[0]);
      const where = ` WHERE v.${columns[0]} = t.${columns[0]}`;
      columns[0] = "?" + columns[0];
      const columnSet = new pgp.helpers.ColumnSet(columns, { table });

      return pgp.helpers.update(data, columnSet) + where + " RETURNING *";
    } else {
      const columns = Object.keys(data).slice(1);
      const whereCondition = Object.entries(data)[0];
      const where = { [whereCondition[0]]: whereCondition[1] as string };
      const whereClause = this.createWhereClause(where);

      return (
        pgp.helpers.update(data, columns, table) + whereClause + " RETURNING *"
      );
    }
  }

  private createWhereClause(
    where: WhereCondition | WhereCondition[],
    operator: "AND" | "OR" = "AND",
  ): string {
    let query: string;
    let values: string[] = [];

    if (Array.isArray(where)) {
      query = where.reduce<string>((whereString, whereClause, index) => {
        const [pairs] = Object.entries(whereClause);
        return whereString.concat(
          `${index === 0 ? " WHERE" : ` ${operator}`} ${pairs[0]}=$${
            index + 1
          }`,
        );
      }, "");
      values = where.map((item) => {
        const [pairs] = Object.entries(item);
        return pairs[1];
      });
    } else {
      const [[column, value]] = Object.entries(where);
      query = ` WHERE ${column}=$1`;
      values = [value];
    }

    return pgp.as.format(query, values);
  }

  private createWhereClauseFromArray(where: WhereCondition): string {
    const [[column, arrayValue]] = Object.entries(where);

    return pgp.as.format(`WHERE ${column}=ANY(ARRAY[$1:raw])`, [arrayValue]);
  }
}
