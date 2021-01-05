import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { GraphQLRequestContext } from "apollo-server-types";

export type GraphQLFields = {
  [key: string]: GraphQLFieldConfig<
    GraphQLObjectType,
    GraphQLRequestContext,
    { [argName: string]: any }
  >;
};

export type Value = string | number | boolean | Date;

export type ColumnValue<T> = { [key: string]: T };

export interface CreateParams<T> {
  table: string;
  tableValues: T;
}
export interface DeleteParams {
  table: string;
  whereClause: WhereCondition | WhereCondition[];
  operator?: "AND" | "OR";
}
export interface CreateManyParams<T> {
  table: string;
  tableValuesArray: T[];
}

export interface TableParams {
  table: string;
}

export interface QueryParams extends TableParams {
  column: string;
  value: string;
}

export interface UpdateOneParams {
  table: string;
  data: { [key: string]: any };
}
export interface UpdateManyParams {
  table: string;
  data: { [key: string]: any }[];
}
export interface UpdateQueryParams {
  table: string;
  data: { [key: string]: any } | { [key: string]: any }[];
}

export interface WhereParams extends QueryParams {
  whereClause: WhereCondition | WhereCondition[];
}

export interface ReadParams extends TableParams {
  whereClause: WhereCondition | WhereCondition[];
}

export interface WhereCondition {
  [key: string]: any;
}

export interface BillEvent {
  description: string;
  link: string;
  title: string;
  pubDate: string;
}
export interface BillSummaryMap {
  code: string;
  url: string;
}
