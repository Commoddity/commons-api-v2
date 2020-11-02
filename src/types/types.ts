import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";

export type GraphQLFields = {
  [key: string]: GraphQLFieldConfig<
    GraphQLObjectType,
    any,
    { [argName: string]: string }
  >;
};
