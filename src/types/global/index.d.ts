import { GraphQLRequestContext } from "apollo-server-types";
import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { Where } from "join-monster";

declare global {
  type PostgresDBConnection = pgPromise.IDatabase<
    Record<string, unknown>,
    pg.IClient
  >;
  type PostgresPGP = pgPromise.IMain<Record<string, unknown>, pg.IClient>;

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
    operator?: "AND" | "OR";
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
  interface ParsedUserIdentities {
    providerName: "Facebook" | "Google" | "SignInWithApple";
    userId: string;
  }

  type UserAttributes = {
    userAttributes: {
      email: string;
      identities?: string;
      given_name?: string;
      family_name?: string;
      name?: string;
    };
  };

  type SocialUserAttributes = AppleUserAttributes | FacebookUserAttributes;

  interface EmailUserAttributes {
    userAttributes: {
      email: string;
      given_name: string;
      family_name: string;
    };
  }

  interface AppleUserAttributes {
    userAttributes: { identities: string; email: string; name: string };
  }
  interface FacebookUserAttributes {
    userAttributes: {
      identities: string;
      email: string;
      given_name: string;
      family_name: string;
    };
  }
}
