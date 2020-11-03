import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { GraphQLRequestContext } from "apollo-server-types";

export type GraphQLFields = {
  [key: string]: GraphQLFieldConfig<
    GraphQLObjectType,
    GraphQLRequestContext,
    { [argName: string]: string }
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
