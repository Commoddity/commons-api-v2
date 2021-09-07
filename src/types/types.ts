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

export type PQuery = { [key: string]: any };

export interface PQueryOptions {
  limit?: number;
  sort?: { [field: string]: 1 | -1 };
  hard?: boolean;
  excludeDeleted?: boolean;
}

export interface PUpdateBillCategories {
  code: string;
  category: EBillCategories;
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

export interface PPassedUpdate {
  passed: boolean;
  passedDate?: string;
}

/* Interfaces */
export interface IAppleUserAttributes {
  userAttributes: { identities: string; email: string; name: string };
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

export interface IEmailUserAttributes {
  userAttributes: {
    email: string;
    given_name: string;
    family_name: string;
  };
}

export interface IFacebookUserAttributes {
  userAttributes: {
    identities: string;
    email: string;
    given_name: string;
    family_name: string;
  };
}

export interface IParsedUserIdentities {
  providerName: "Facebook" | "Google" | "SignInWithApple";
  userId: string;
}

export type ISocialUserAttributes =
  | IAppleUserAttributes
  | IFacebookUserAttributes;

export type IUserAttributes = {
  userAttributes: {
    email: string;
    identities?: string;
    given_name?: string;
    family_name?: string;
    name?: string;
  };
};

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

export enum ERecordStatus {
  Created = "created",
  Deleted = "deleted",
}
