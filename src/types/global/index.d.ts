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
  interface PUpdateBillCategories {
    code: string;
    category: EBillCategories;
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
  interface PBillEvent {
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

  enum ERecordStatus {
    Created = "created",
    Deleted = "deleted",
  }

  type PQuery = { [key: string]: any };

  interface PQueryOptions {
    limit?: number;
    sort?: { [string]: 1 | -1 };
    hard?: boolean;
    excludeDeleted?: boolean;
  }

  /* */
  enum EBillCategories {
    // Agriculture, environment, fisheries and natural resources
    agriculture_environment = "agriculture_environment",
    // Arts, culture and entertainment
    arts_culture = "arts_culture",
    // Business, industry and trade
    business_industry = "business_industry",
    // Economics and finance
    economics_finance = "economics_finance",
    // Education, language and training
    education_language = "education_language",
    // Employment and labour
    employment_labour = "employment_labour",
    // Government, Parliament and politics
    government_politics = "government_politics",
    // Health and safety
    health_safety = "health_safety",
    // Indigenous affairs
    indigenous_affairs = "indigenous_affairs",
    // Information and communications
    information_communications = "information_communications",
    // International affairs and defence
    international_affairs = "international_affairs",
    // Law, justice and rights
    law_justice = "law_justice",
    // Science and technology
    science_technology = "science_technology",
    // Social affairs and population
    social_affairs = "social_affairs",
  }

  enum ECredentialTypes {
    Apple = "apple",
    Facebook = "facebook",
    Username = "username",
  }
}
