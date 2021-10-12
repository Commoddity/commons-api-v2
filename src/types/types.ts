import { ArticleData } from "article-parser";
import { QueryOptions } from "mongoose";
import { MapiResponse } from "@mapbox/mapbox-sdk/lib/classes/mapi-response";

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

export interface PGeocodeQuery {
  street: string;
  city: string;
  province: EProvinceCodes;
}

/* Interfaces */
export type ICognitoUserAttributes =
  | ICognitoEmailUserAttributes
  | ICognitoSocialUserAttributes;
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

export enum EMPOfficeType {
  constituency = "constituency",
  legislature = "legislature",
}

export interface IMemberOfParliament {
  name: string;
  party: string;
  riding: string;
  email: string;
  phoneNumber: string;
  ourCommonsUrl: string;
  photoUrl: string;
  preferredLanguages: string[];
  offices: IMPOffice[];
}

export interface IMPOffice {
  type: EMPOfficeType;
  phoneNumber: string;
  faxNumber: string;
  address: IMPAddress;
}

export interface IMPAddress {
  name: string;
  street: string;
  city: string;
  province: EProvinceCodes;
  postalCode: string;
}

/* Enums */
export enum EBillCategories {
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

export enum EBillEndpoints {
  LEGISINFO_URL = "https://www.parl.ca/LegisInfo/RSSFeed.aspx?download=rss&Language=E&Mode=1&Source=LegislativeFilteredBills&AllBills=1&HOCEventTypes=60110,60111,60146,60306,60122,60115,60119,60121,60124,60125,60126,60127,60285,60145,60307,60128,60131,60132,60133,60134,60174,60112,60163,60304,60303,60139,60144,60136,60138,60142&SenateEventTypes=60109,60110,60111,60115,60118,60119,60120,60123,60124,60305,60286,60130,60129,60302,60131,60132,60133,60134,60147,60304,60303,60140,60143,60135,60137,60141,60149",
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

export enum EProvinceCodes {
  AB = "AB",
  BC = "BC",
  MB = "MB",
  NB = "NB",
  NL = "NL",
  NS = "NS",
  NT = "NT",
  NU = "NU",
  ON = "ON",
  PE = "PE",
  QC = "QC",
  SK = "SK",
  YT = "YT",
}

export enum ERecordStatus {
  Created = "created",
  Deleted = "deleted",
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
  publicationDate: Date;
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
