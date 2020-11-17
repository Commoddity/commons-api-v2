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

export interface WhereParams extends QueryParams {
  where: WhereCondition | WhereCondition[];
}

export interface ReadParams extends TableParams {
  where: WhereCondition | WhereCondition[];
}

export interface WhereCondition {
  column: string;
  value: string;
}

export interface BillEvent {
  description: string;
  link: string;
  title: string;
  pubDate: string;
}
