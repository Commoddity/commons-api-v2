import { GraphQLRequestContext } from "apollo-server-types";
import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { Where } from "join-monster";

declare global {
  // GraphQL Types
  type GraphQLFields = {
    [key: string]: JoinMonsterQuery;
  };
  interface JoinMonsterQuery
    extends GraphQLFieldConfig<
      GraphQLObjectType,
      GraphQLRequestContext,
      { [argName: string]: any }
    > {
    where?: Where<GraphQLRequestContext, { [argName: string]: any }>;
  }

  // Base Service Params
  interface CreateParams<T> {
    table: string;
    tableValues: T;
  }
  interface CreateManyParams<T> {
    table: string;
    tableValuesArray: T[];
  }
  interface DeleteParams {
    table: string;
    where: WhereCondition | WhereCondition[];
    operator?: "AND" | "OR";
  }
  interface QueryParams extends TableParams {
    column: string;
    value: string;
  }
  interface ReadParams extends TableParams {
    where: WhereCondition | WhereCondition[];
  }
  interface TableParams {
    table: string;
  }
  interface UpdateBillCategoriesParams {
    code: string;
    categories: string[];
  }
  interface UpdateManyParams {
    table: string;
    data: { [key: string]: any }[];
  }
  interface UpdateOneParams {
    table: string;
    data: { [key: string]: any };
  }
  interface UpdateQueryParams {
    table: string;
    data: { [key: string]: any } | { [key: string]: any }[];
  }
  interface WhereCondition {
    [key: string]: any;
  }
  interface WhereParams extends QueryParams {
    where: WhereCondition | WhereCondition[];
  }

  // Model types
  interface BillEvent {
    description: string;
    link: string;
    title: string;
    pubDate: string;
  }
  interface BillSummaryMap {
    code: string;
    url: string;
  }
  type ColumnValue<T> = { [key: string]: T };
  type Value = string | number | boolean | Date;
}
