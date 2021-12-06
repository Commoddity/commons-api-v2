import { ArticleData } from "article-parser";
import { QueryOptions } from "mongoose";
import { MapiResponse } from "@mapbox/mapbox-sdk/lib/classes/mapi-response";

import { EMPOfficeType } from "./schema-types";

export enum Envs {
  dev = "dev",
  production = "production",
}

/* Parameters */
export interface PBillEvent {
  description: string;
  link: string;
  title: string;
  pubDate: string;
}

export interface PFetchPage {
  pageUrl: string;
  billCode: string;
}

export interface PQueryOptions extends QueryOptions {
  hard?: boolean;
}

export interface PUpdatePassed {
  code: string;
  passed: boolean;
  pageUrl?: string;
}

export interface PUpdateSummary {
  code: string;
  summaryUrl: string;
}

export interface PBillFetch {
  parliament: number;
  session: number;
  code?: string;
}

/* Interfaces */
export type ICognitoUserAttributes = ICognitoEmailUserAttributes | ICognitoSocialUserAttributes;
export type ICognitoSocialUserAttributes =
  | ICognitoAppleUserAttributes
  | ICognitoFacebookUserAttributes;
export interface ICognitoAppleUserAttributes {
  identities: string;
  email: string;
  name: string;
}
export interface ICognitoEmailUserAttributes {
  email: string;
  given_name: string;
  family_name: string;
}
export interface ICognitoFacebookUserAttributes {
  identities: string;
  email: string;
  given_name: string;
  family_name: string;
}
export interface ICognitoParsedUserIdentities {
  providerName: ECognitoProviders;
  userId: string;
}
export enum ECognitoProviders {
  Facebook = "Facebook",
  Google = "Google",
  SignInWithApple = "SignInWithApple",
}

export interface IBillSummary {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
}

export interface IBillSummaryMap {
  code: string;
  url: string;
}

export interface IMapBoxResponse extends MapiResponse {
  body: {
    type: string;
    query: string[];
    features: IMapBoxFeature[];
    attribution: "NOTICE: © 2021 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service (https://www.mapbox.com/about/maps/). This response and the information it contains may not be retained. POI(s) provided by Foursquare.";
  };
}

interface IMapBoxFeature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: { accuracy: string };
  text: string;
  place_name: string;
  center: number[];
  geometry: IMapBoxGeometry;
  address: string;
  context: IMapBoxFeatureContext[];
}

interface IMapBoxGeometry {
  type: string;
  coordinates: number[];
  interpolated?: boolean;
}

interface IMapBoxFeatureContext {
  id: string;
  text: string;
  wikidata?: string;
  short_code?: string;
}

export interface ILatLng {
  latitude: number;
  longitude: number;
}

export interface IRepresentMPResponse {
  objects: IRepresentMP[];
  meta: {
    previous: number;
    limit: number;
    total_count: number;
    offset: number;
    next: number;
  };
}

export interface IRepresentMP {
  name: string;
  first_name: string;
  last_name: string;
  party_name: string;
  email: string;
  district_name: string;
  photo_url: string;
  personal_url: string;
  representative_set_name: string;
  elected_office: string;
  related: {
    boundary_url: string;
    representative_set_url: string;
  };
  source_url: string;
  extra: {
    preferred_languages: ["English  French"];
  };
  offices: IRepresentOffice[];
  gender: string;
  url: string;
}

export interface IRepresentOffice {
  type: EMPOfficeType;
  tel: string;
  postal: string;
  fax: string;
}

/* Enums */
export enum EBillEndpoints {
  SUMMARY_URL = "https://www.parl.ca/legisinfo/RSSFeed.aspx?download=rss&Language=E&source=LegislativeSummaryPublications",
}

export enum ECredentialTypes {
  Apple = "apple",
  Facebook = "facebook",
  Username = "username",
}

export enum EDataEndpoints {
  MP_ENDPOINT = "https://represent.opennorth.ca",
  MBFC_HOMEPAGE = "https://mediabiasfactcheck.com",
  BP_PRESS_AI = "https://api.thebipartisanpress.com/api/endpoints/beta/robert",
}

export enum ESSMParams {
  // To use, submit POST request to endpoint url with body of ”API=apikey&Text=text content”
  // The endpoint return data with bias from -42 to 42
  BPPressApiKey = "BPPressApiKey",
  MapBoxToken = "MapBoxToken",
  MongoConnectionString = "MongoConnectionString",
  UserPoolId = "UserPoolId",
}

/* AWS Types */
export interface IAppSyncResolverEvent<A = any, S = any> {
  arguments: A;
  field: string;
  source?: S;
  identity?: {
    claims: { "custom:userId": string };
  };
}

export interface ICloudWatchEvent {
  eventSource: string;
  header: {
    eventType: { entityType: EEntityTypes; type: EEventTypes };
    environment: Envs;
  };
}

export enum EEntityTypes {
  Bills = "Bills",
}

export enum EEventTypes {
  UpdateBills = "UpdateBills",
}

export interface ICognitoContext {
  callbackWaitsForEmptyEventLoop: boolean;
  functionVersion: string;
  functionName: string;
  memoryLimitInMB: string;
  logGroupName: string;
  logStreamName: string;
  invokedFunctionArn: string;
  awsRequestId: string;
}

export interface ICognitoEvent {
  version: string;
  region: string;
  userPoolId: string;
  userName: string;
  callerContext: {
    awsSdkVersion: string;
    clientId: string;
  };
  triggerSource: ECognitoTriggerSource;
  request: {
    userAttributes: ICognitoUserAttributes;
    validationData: any;
  };
  response: {
    autoConfirmUser: boolean;
    autoVerifyEmail: boolean;
    autoVerifyPhone: boolean;
  };
}

export enum ECognitoTriggerSource {
  PreSignUp_SignUp = "PreSignUp_SignUp",
  PostConfirmation_ConfirmSignUp = "PostConfirmation_ConfirmSignUp",
}

export interface IArticleData extends ArticleData {
  hostname: string;
  publicationDate: string;
}

export interface IMBFCResults {
  biasRating?: string;
  factualReporting?: string;
  country?: string;
  mediaType?: string;
  trafficPopularity?: string;
  mbfcCredibilityRating?: string;
}

export interface ISourceSplit {
  name: string;
  symbol: string;
  sourceBefore: boolean;
}
