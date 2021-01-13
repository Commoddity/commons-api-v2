import { GraphQLResolveInfo } from "graphql";
import joinMonster from "join-monster";

import { db, pgp } from "@db";

export class QueryUtils {
  static createDeleteQuery(
    table: string,
    where: WhereCondition | WhereCondition[],
    operator?: "AND" | "OR",
  ): string {
    const whereClause = this.createWhereClause(where, operator);
    const baseQuery = "DELETE FROM $1:raw" + whereClause;

    return pgp.as.format(baseQuery, [table]);
  }

  static createInsertQuery(tableValues: any | any[], table: string): string {
    let exampleRow: string[];

    if (Array.isArray(tableValues)) {
      exampleRow = Object.keys(tableValues[0]);
    } else {
      exampleRow = Object.keys(tableValues);
    }

    const columnSet = new pgp.helpers.ColumnSet(exampleRow, { table });

    return pgp.helpers.insert(tableValues, columnSet) + " RETURNING *";
  }

  static createSelectQuery(
    table: string,
    where: string,
    multiple = false,
  ): string {
    const baseQuery = multiple
      ? "SELECT * FROM $1:raw $2:raw"
      : "SELECT * FROM $1:raw $2:raw LIMIT 1";

    return pgp.as.format(baseQuery, [table, where]);
  }

  static createUpdateQuery({ table, data }: UpdateQueryParams): string {
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

  static createWhereClause(
    where: WhereCondition | WhereCondition[],
    operator: "AND" | "OR" = "AND",
  ): string {
    let query: string;
    let values: string[] = [];

    console.log("INSIDE", where);

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

  static createGraphQLWhereClause(table: string, args: GraphQLArgs): string {
    const whereClause: string[] = [];
    const values: any[] = [];

    Object.entries(args).forEach(([arg, value], index) => {
      whereClause.push(`${table}.${arg}=$${index + 1}`);
      values.push(value);
    });

    return pgp.as.format(whereClause.join(" AND "), values);
  }

  static async graphQLQuery(resolveInfo: GraphQLResolveInfo) {
    return new Promise<any>((resolve, reject) =>
      joinMonster(resolveInfo, {}, async (sql: string) => {
        console.log("SQL IS HERE", sql);
        try {
          const result = await db.query(sql);
          console.log("RESULT IS HERE", result);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }),
    );
  }

  static createWhereClauseFromArray(where: WhereCondition): string {
    const [[column, arrayValue]] = Object.entries(where);

    return pgp.as.format(`WHERE ${column}=ANY(ARRAY[$1:raw])`, [arrayValue]);
  }
}
