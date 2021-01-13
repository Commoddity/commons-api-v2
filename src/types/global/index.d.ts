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
      GraphQLArgs
    > {
    extensions?: {
      joinMonster: {
        where?: Where<GraphQLRequestContext, { [argName: string]: any }>;
      };
    };
    //REMOVE THIS ONCE MOVED TO PGP QUERY STRING CREATION
    where?: Where<GraphQLRequestContext, { [argName: string]: any }>;
    //REMOVE THIS ONCE MOVED TO PGP QUERY STRING CREATION
  }

  type GraphQLArgs = { [argName: string]: any };

  // Base Service Params
  interface CreateParams<T> {
    table: string;
    tableValues: T;
  }
  interface CreateJoinParams {
    idOne: { [key: string]: string };
    idTwo: { [key: string]: string };
    table: string;
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

  interface FetchPageParams {
    pageUrl: string;
    billCode: string;
  }
  interface FindAllValuesParams {
    table: string;
    column: string;
    sort?: boolean;
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
  interface UpdatePassedParams {
    code: string;
    passed: boolean;
  }
  interface UpdateQueryParams {
    table: string;
    data: { [key: string]: any } | { [key: string]: any }[];
  }
  interface UpdateSummaryParams {
    code: string;
    summary_url: string;
  }
  interface WhereCondition {
    [key: string]: any;
  }
  interface WhereParams {
    table: string;
    where: WhereCondition | WhereCondition[] | any[];
    arraySearch?: boolean;
  }

  // Model types
  interface BillCategory {
    bill_id: string;
    category_id: string;
  }
  interface BillEventRes {
    description: string[];
    link: string[];
    title: string[];
    pubDate: string[];
  }
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

  interface BillSummary {
    title: string;
    link: string;
    description?: string;
    pubDate?: string;
  }
  type ColumnValue<T> = { [key: string]: T };
  type Value = string | number | boolean | Date;
}
