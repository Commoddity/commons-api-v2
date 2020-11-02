import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { GraphQLRequestContext } from "apollo-server-types";

export type GraphQLFields = {
  [key: string]: GraphQLFieldConfig<
    GraphQLObjectType,
    GraphQLRequestContext,
    { [argName: string]: string }
  >;
};
