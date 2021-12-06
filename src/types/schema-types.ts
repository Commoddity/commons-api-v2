export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum EBillCategories {
  agriculture_environment = 'agriculture_environment',
  arts_culture = 'arts_culture',
  business_industry = 'business_industry',
  economics_finance = 'economics_finance',
  education_language = 'education_language',
  employment_labour = 'employment_labour',
  government_politics = 'government_politics',
  health_safety = 'health_safety',
  indigenous_affairs = 'indigenous_affairs',
  information_communications = 'information_communications',
  international_affairs = 'international_affairs',
  law_justice = 'law_justice',
  science_technology = 'science_technology',
  social_affairs = 'social_affairs'
}

export enum EBillType {
  commons = 'commons',
  senate = 'senate'
}

export enum EMPOfficeType {
  constituency = 'constituency',
  legislature = 'legislature'
}

export enum EProvinceCodes {
  AB = 'AB',
  BC = 'BC',
  MB = 'MB',
  NB = 'NB',
  NL = 'NL',
  NS = 'NS',
  NT = 'NT',
  NU = 'NU',
  ON = 'ON',
  PE = 'PE',
  QC = 'QC',
  SK = 'SK',
  YT = 'YT'
}

export enum ERecordStatus {
  created = 'created',
  deleted = 'deleted'
}

export type IBibliographicNotice = {
  __typename?: 'IBibliographicNotice';
  Author?: Maybe<Scalars['String']>;
  BibliographicNoticeId?: Maybe<Scalars['Int']>;
  BillDocumentId: Scalars['ID'];
  Classification?: Maybe<Scalars['String']>;
  IsOnlineVersionAvailable?: Maybe<Scalars['Boolean']>;
  LanguageId?: Maybe<Scalars['Int']>;
  Publication?: Maybe<Scalars['String']>;
  PublicationDate?: Maybe<Scalars['String']>;
  Title?: Maybe<Scalars['String']>;
  VolumePage?: Maybe<Scalars['String']>;
};

export type IBill = {
  __typename?: 'IBill';
  BibliographicNotices?: Maybe<Array<Maybe<IBibliographicNotice>>>;
  BillDocumentTypeId?: Maybe<Scalars['Int']>;
  BillDocumentTypeName?: Maybe<Scalars['String']>;
  BillDocumentTypeNameEn?: Maybe<Scalars['String']>;
  BillDocumentTypeNameFr?: Maybe<Scalars['String']>;
  BillFormId?: Maybe<Scalars['Int']>;
  BillFormName?: Maybe<Scalars['String']>;
  BillFormNameEn?: Maybe<Scalars['String']>;
  BillFormNameFr?: Maybe<Scalars['String']>;
  BillStages?: Maybe<IBillStages>;
  ConsideredDuringPreviousSitting?: Maybe<Scalars['Boolean']>;
  DidReinstateFromPreviousSession?: Maybe<Scalars['Boolean']>;
  DidReinstateInNextSession?: Maybe<Scalars['Boolean']>;
  HouseRulingAndStatements?: Maybe<Array<Maybe<IRulingAndStatements>>>;
  HouseVoteDetails?: Maybe<Array<Maybe<IVoteDetails>>>;
  Id: Scalars['ID'];
  IsDroppedFromSenateOrderPaper?: Maybe<Scalars['Boolean']>;
  IsFullLegislativeSummaryAvailable?: Maybe<Scalars['Boolean']>;
  IsGovernmentBill?: Maybe<Scalars['Boolean']>;
  IsHouseBill?: Maybe<Scalars['Boolean']>;
  IsInSenatePreStudy?: Maybe<Scalars['Boolean']>;
  IsProForma?: Maybe<Scalars['Boolean']>;
  IsSenateBill?: Maybe<Scalars['Boolean']>;
  IsSessionOngoing?: Maybe<Scalars['Boolean']>;
  LatestBillEventAdditionalInformation?: Maybe<Scalars['String']>;
  LatestBillEventAdditionalInformationEn?: Maybe<Scalars['String']>;
  LatestBillEventAdditionalInformationFr?: Maybe<Scalars['String']>;
  LatestBillEventAmendmentNoteId?: Maybe<Scalars['Int']>;
  LatestBillEventChamberName?: Maybe<Scalars['String']>;
  LatestBillEventChamberNameEn?: Maybe<Scalars['String']>;
  LatestBillEventChamberNameFr?: Maybe<Scalars['String']>;
  LatestBillEventChamberOrganizationId?: Maybe<Scalars['Int']>;
  LatestBillEventCommitteeDetails?: Maybe<Scalars['String']>;
  LatestBillEventDateTime?: Maybe<Scalars['String']>;
  LatestBillEventEventTypeId?: Maybe<Scalars['Int']>;
  LatestBillEventMeetingNumber?: Maybe<Scalars['String']>;
  LatestBillEventNumberOfAmendments?: Maybe<Scalars['Int']>;
  LatestBillEventStageId?: Maybe<Scalars['Int']>;
  LatestBillEventTypeName?: Maybe<Scalars['String']>;
  LatestBillEventTypeNameEn?: Maybe<Scalars['String']>;
  LatestBillEventTypeNameFr?: Maybe<Scalars['String']>;
  LatestCompletedBillStageChamberName?: Maybe<Scalars['String']>;
  LatestCompletedBillStageChamberNameEn?: Maybe<Scalars['String']>;
  LatestCompletedBillStageChamberNameFr?: Maybe<Scalars['String']>;
  LatestCompletedBillStageChamberOrganizationId?: Maybe<Scalars['Int']>;
  LatestCompletedBillStageDateTime?: Maybe<Scalars['String']>;
  LatestCompletedBillStageId?: Maybe<Scalars['Int']>;
  LatestCompletedBillStageName?: Maybe<Scalars['String']>;
  LatestCompletedBillStageNameEn?: Maybe<Scalars['String']>;
  LatestCompletedBillStageNameFr?: Maybe<Scalars['String']>;
  LatestCompletedMajorStageChamberName?: Maybe<Scalars['String']>;
  LatestCompletedMajorStageChamberNameEn?: Maybe<Scalars['String']>;
  LatestCompletedMajorStageChamberNameFr?: Maybe<Scalars['String']>;
  LatestCompletedMajorStageChamberOrganizationId?: Maybe<Scalars['Int']>;
  LatestCompletedMajorStageId?: Maybe<Scalars['Int']>;
  LatestCompletedMajorStageName?: Maybe<Scalars['String']>;
  LatestCompletedMajorStageNameEn?: Maybe<Scalars['String']>;
  LatestCompletedMajorStageNameFr?: Maybe<Scalars['String']>;
  LatestCompletedMajorStageNameWithChamberSuffix?: Maybe<Scalars['String']>;
  LongTitle?: Maybe<Scalars['String']>;
  LongTitleEn?: Maybe<Scalars['String']>;
  LongTitleFr?: Maybe<Scalars['String']>;
  Notes?: Maybe<Scalars['String']>;
  NotesEn?: Maybe<Scalars['String']>;
  NotesFr?: Maybe<Scalars['String']>;
  Number?: Maybe<Scalars['Int']>;
  NumberCode?: Maybe<Scalars['String']>;
  NumberPrefix?: Maybe<Scalars['String']>;
  OngoingStageId?: Maybe<Scalars['Int']>;
  OngoingStageName?: Maybe<Scalars['String']>;
  OngoingStageNameEn?: Maybe<Scalars['String']>;
  OngoingStageNameFr?: Maybe<Scalars['String']>;
  OriginatingChamberName?: Maybe<Scalars['String']>;
  OriginatingChamberNameEn?: Maybe<Scalars['String']>;
  OriginatingChamberNameFr?: Maybe<Scalars['String']>;
  OriginatingChamberOrganizationId?: Maybe<Scalars['Int']>;
  ParliamentNumber?: Maybe<Scalars['Int']>;
  PassedFirstChamberFirstReading?: Maybe<Scalars['Boolean']>;
  PassedFirstChamberSecondReading?: Maybe<Scalars['Boolean']>;
  PassedFirstChamberThirdReading?: Maybe<Scalars['Boolean']>;
  PassedHouseFirstReadingDateTime?: Maybe<Scalars['String']>;
  PassedHouseSecondReadingDateTime?: Maybe<Scalars['String']>;
  PassedHouseThirdReadingDateTime?: Maybe<Scalars['String']>;
  PassedSecondChamberFirstReading?: Maybe<Scalars['Boolean']>;
  PassedSecondChamberSecondReading?: Maybe<Scalars['Boolean']>;
  PassedSecondChamberThirdReading?: Maybe<Scalars['Boolean']>;
  PassedSenateFirstReadingDateTime?: Maybe<Scalars['String']>;
  PassedSenateSecondReadingDateTime?: Maybe<Scalars['String']>;
  PassedSenateThirdReadingDateTime?: Maybe<Scalars['String']>;
  Publications?: Maybe<Array<Maybe<IPublication>>>;
  ReceivedRoyalAssent?: Maybe<Scalars['Boolean']>;
  ReceivedRoyalAssentDateTime?: Maybe<Scalars['String']>;
  ReinstatedAsBillDocumentId?: Maybe<Scalars['String']>;
  ReinstatedAsBillNumberCode?: Maybe<Scalars['String']>;
  ReinstatedFromBillDocumentId?: Maybe<Scalars['String']>;
  ReinstatedFromBillNumberCode?: Maybe<Scalars['String']>;
  SenateRulingAndStatements?: Maybe<Array<Maybe<IRulingAndStatements>>>;
  SenateVoteDetails?: Maybe<Array<Maybe<IVoteDetails>>>;
  SessionNumber?: Maybe<Scalars['Int']>;
  ShortLegislativeSummary?: Maybe<Scalars['String']>;
  ShortLegislativeSummaryEn?: Maybe<Scalars['String']>;
  ShortLegislativeSummaryFr?: Maybe<Scalars['String']>;
  ShortTitle?: Maybe<Scalars['String']>;
  ShortTitleEn?: Maybe<Scalars['String']>;
  ShortTitleFr?: Maybe<Scalars['String']>;
  SimilarBills?: Maybe<Array<Maybe<IBill>>>;
  SponsorAffiliationRoleId?: Maybe<Scalars['Int']>;
  SponsorAffiliationRoleName?: Maybe<Scalars['String']>;
  SponsorAffiliationRoleNameEn?: Maybe<Scalars['String']>;
  SponsorAffiliationRoleNameFr?: Maybe<Scalars['String']>;
  SponsorAffiliationTitle?: Maybe<Scalars['String']>;
  SponsorAffiliationTitleEn?: Maybe<Scalars['String']>;
  SponsorAffiliationTitleFr?: Maybe<Scalars['String']>;
  SponsorConstituencyId?: Maybe<Scalars['Int']>;
  SponsorConstituencyName?: Maybe<Scalars['String']>;
  SponsorConstituencyNameEn?: Maybe<Scalars['String']>;
  SponsorConstituencyNameFr?: Maybe<Scalars['String']>;
  SponsorPersonId?: Maybe<Scalars['Int']>;
  SponsorPersonMiddleName?: Maybe<Scalars['String']>;
  SponsorPersonName?: Maybe<Scalars['String']>;
  SponsorPersonOfficialFirstName?: Maybe<Scalars['String']>;
  SponsorPersonOfficialLastName?: Maybe<Scalars['String']>;
  SponsorPersonShortHonorific?: Maybe<Scalars['String']>;
  SponsorPersonShortHonorificEn?: Maybe<Scalars['String']>;
  SponsorPersonShortHonorificFr?: Maybe<Scalars['String']>;
  SponsorPersonUsualFirstName?: Maybe<Scalars['String']>;
  SponsorSenateSystemAffiliationId?: Maybe<Scalars['Int']>;
  StatusId?: Maybe<Scalars['Int']>;
  StatusName?: Maybe<Scalars['String']>;
  StatusNameEn?: Maybe<Scalars['String']>;
  StatusNameFr?: Maybe<Scalars['String']>;
  StatuteChapter?: Maybe<Scalars['String']>;
  StatuteYear?: Maybe<Scalars['String']>;
  WebReferences?: Maybe<Array<Maybe<IWebReference>>>;
  billAddedFields: IBillAddedFields;
};

export type IBillAddedFields = {
  __typename?: 'IBillAddedFields';
  categories?: Maybe<Array<Maybe<EBillCategories>>>;
  code: Scalars['String'];
  createdAt: Scalars['String'];
  fullTextUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  mediaSources?: Maybe<Array<Maybe<IBillMediaSource>>>;
  pageUrl: Scalars['String'];
  parliamentarySession: Scalars['String'];
  recordStatus: ERecordStatus;
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
};

export type IBillMediaSource = {
  __typename?: 'IBillMediaSource';
  author?: Maybe<Scalars['String']>;
  bpPressArticleRating?: Maybe<Scalars['Float']>;
  content?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  hostname?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  isEditorial?: Maybe<Scalars['Boolean']>;
  links?: Maybe<Array<Maybe<Scalars['String']>>>;
  mbfcData?: Maybe<IMediaBiasFactCheckData>;
  mediaSourceId: Scalars['ID'];
  publicationDate?: Maybe<Scalars['String']>;
  published?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  ttr?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
};

export type IBillStage = {
  __typename?: 'IBillStage';
  BillStageId: Scalars['ID'];
  BillStageName?: Maybe<Scalars['String']>;
  BillStageNameEn?: Maybe<Scalars['String']>;
  BillStageNameFr?: Maybe<Scalars['String']>;
  ChamberOrganizationId?: Maybe<Scalars['Int']>;
  Committee?: Maybe<Scalars['String']>;
  CommitteeMeetings?: Maybe<Array<Maybe<ICommitteeMeeting>>>;
  ContainsRecommittalOfBillEvent?: Maybe<Scalars['Boolean']>;
  ContainsReferralToCommitteeEvent?: Maybe<Scalars['Boolean']>;
  Decisions?: Maybe<Array<Maybe<ISitting>>>;
  EndOfStageEvent?: Maybe<IEndOfStageEvent>;
  LastStageEventStartDateTime?: Maybe<Scalars['String']>;
  ParliamentNumber?: Maybe<Scalars['Int']>;
  SessionNumber?: Maybe<Scalars['Int']>;
  SignificantEvents?: Maybe<Array<Maybe<ISignificantEvent>>>;
  Sittings?: Maybe<Array<Maybe<ISitting>>>;
  Speeches?: Maybe<Array<Maybe<ISpeech>>>;
  StageEventCount?: Maybe<Scalars['Int']>;
  State?: Maybe<Scalars['Int']>;
  StateAsOfDate?: Maybe<Scalars['String']>;
  StateName?: Maybe<Scalars['String']>;
  StateNameEn?: Maybe<Scalars['String']>;
  StateNameFr?: Maybe<Scalars['String']>;
};

export type IBillStages = {
  __typename?: 'IBillStages';
  BillId: Scalars['ID'];
  HouseBillStages?: Maybe<Array<Maybe<IBillStage>>>;
  SenateBillStages?: Maybe<Array<Maybe<IBillStage>>>;
};

export type ICommitteeMeeting = {
  __typename?: 'ICommitteeMeeting';
  CommitteeAcronym?: Maybe<Scalars['String']>;
  CommitteeName?: Maybe<Scalars['String']>;
  CommitteeNameEn?: Maybe<Scalars['String']>;
  CommitteeNameFr?: Maybe<Scalars['String']>;
  CommitteeOrganizationId?: Maybe<Scalars['Int']>;
  Date?: Maybe<Scalars['String']>;
  Number?: Maybe<Scalars['String']>;
};

export type IDecision = {
  __typename?: 'IDecision';
  DecisionMethodId?: Maybe<Scalars['Int']>;
  DecisionMethodName?: Maybe<Scalars['String']>;
  DecisionMethodNameEn?: Maybe<Scalars['String']>;
  DecisionMethodNameFr?: Maybe<Scalars['String']>;
  DecisionMotionDocumentId?: Maybe<Scalars['Int']>;
  DecisionMotionTitle?: Maybe<Scalars['String']>;
  DecisionMotionTitleEn?: Maybe<Scalars['String']>;
  DecisionMotionTitleFr?: Maybe<Scalars['String']>;
  DecisionProceduralEventId?: Maybe<Scalars['Int']>;
  DecisionResultId?: Maybe<Scalars['Int']>;
  DecisionResultName?: Maybe<Scalars['String']>;
  DecisionResultNameEn?: Maybe<Scalars['String']>;
  DecisionResultNameFr?: Maybe<Scalars['String']>;
  DecisionSittingDate?: Maybe<Scalars['String']>;
  DecisionSittingNumber?: Maybe<Scalars['String']>;
  DivisionNumber?: Maybe<Scalars['Int']>;
  DivisionVotePaired?: Maybe<Scalars['Int']>;
  DivisionVotesNays?: Maybe<Scalars['Int']>;
  DivisionVotesYeas?: Maybe<Scalars['Int']>;
};

export type IEndOfStageEvent = {
  __typename?: 'IEndOfStageEvent';
  EventEndDateTime?: Maybe<Scalars['String']>;
  EventStartDateTime?: Maybe<Scalars['String']>;
  EventTypeId: Scalars['ID'];
  EventTypeName?: Maybe<Scalars['String']>;
  EventTypeNameEn?: Maybe<Scalars['String']>;
  EventTypeNameFr?: Maybe<Scalars['String']>;
};

export type IMPAddress = {
  __typename?: 'IMPAddress';
  city: Scalars['String'];
  name: Scalars['String'];
  postalCode: Scalars['String'];
  province: EProvinceCodes;
  street: Scalars['String'];
};

export type IMPOffice = {
  __typename?: 'IMPOffice';
  address: IMPAddress;
  faxNumber: Scalars['String'];
  phoneNumber: Scalars['String'];
  type: EMPOfficeType;
};

export type IMediaBiasFactCheckData = {
  __typename?: 'IMediaBiasFactCheckData';
  biasRating: Scalars['String'];
  country: Scalars['String'];
  credibilityRating?: Maybe<Scalars['String']>;
  factualReporting: Scalars['String'];
  trafficPopularity?: Maybe<Scalars['String']>;
};

export type IMemberOfParliament = {
  __typename?: 'IMemberOfParliament';
  email: Scalars['String'];
  name: Scalars['String'];
  offices: Array<Maybe<IMPOffice>>;
  ourCommonsUrl: Scalars['String'];
  party: Scalars['String'];
  phoneNumber: Scalars['String'];
  photoUrl: Scalars['String'];
  preferredLanguages: Array<Maybe<Scalars['String']>>;
  riding: Scalars['String'];
};

export type IPublication = {
  __typename?: 'IPublication';
  PublicationId: Scalars['ID'];
  PublicationTypeId?: Maybe<Scalars['Int']>;
  PublicationTypeName?: Maybe<Scalars['String']>;
  PublicationTypeNameEn?: Maybe<Scalars['String']>;
  PublicationTypeNameFr?: Maybe<Scalars['String']>;
};

export type IRulingAndStatements = {
  __typename?: 'IRulingAndStatements';
  ChamberOrganizationId?: Maybe<Scalars['Int']>;
  EventTypeId: Scalars['ID'];
  EventTypeName?: Maybe<Scalars['String']>;
  EventTypeNameEn?: Maybe<Scalars['String']>;
  HansardNumber?: Maybe<Scalars['Int']>;
  MeetingNumber?: Maybe<Scalars['Int']>;
  ParliamentNumber?: Maybe<Scalars['Int']>;
  RulingStatementDateTime?: Maybe<Scalars['String']>;
  SessionNumber?: Maybe<Scalars['Int']>;
  UrlEn?: Maybe<Scalars['String']>;
  UrlFr?: Maybe<Scalars['String']>;
};

export type ISignificantEvent = {
  __typename?: 'ISignificantEvent';
  AdditionalInformation?: Maybe<Scalars['String']>;
  AdditionalInformationEn?: Maybe<Scalars['String']>;
  AdditionalInformationFr?: Maybe<Scalars['String']>;
  AmendmentNoteId?: Maybe<Scalars['Int']>;
  BillDocumentId?: Maybe<Scalars['Int']>;
  CommitteeReportId?: Maybe<Scalars['Int']>;
  CommitteeReportNumber?: Maybe<Scalars['Int']>;
  EventDateTime?: Maybe<Scalars['String']>;
  EventName?: Maybe<Scalars['String']>;
  EventNameEn?: Maybe<Scalars['String']>;
  EventNameFr?: Maybe<Scalars['String']>;
  EventTypeId: Scalars['ID'];
  IsCompletionOfBillStage?: Maybe<Scalars['Boolean']>;
  IsDefeatedEvent?: Maybe<Scalars['Boolean']>;
  MeetingEventId?: Maybe<Scalars['Int']>;
};

export type ISitting = {
  __typename?: 'ISitting';
  AdditionalInformation?: Maybe<Scalars['String']>;
  AdditionalInformationEn?: Maybe<Scalars['String']>;
  AdditionalInformationFr?: Maybe<Scalars['String']>;
  Date?: Maybe<Scalars['String']>;
  Name?: Maybe<Scalars['String']>;
  NameEn?: Maybe<Scalars['String']>;
  NameFr?: Maybe<Scalars['String']>;
  Number?: Maybe<Scalars['String']>;
};

export type ISpeech = {
  __typename?: 'ISpeech';
  BillId: Scalars['ID'];
  CaucusShortName?: Maybe<Scalars['String']>;
  CaucusShortNameEn?: Maybe<Scalars['String']>;
  CaucusShortNameFr?: Maybe<Scalars['String']>;
  ChamberOrganizationId?: Maybe<Scalars['Int']>;
  EventTypeId?: Maybe<Scalars['Int']>;
  EventTypeName?: Maybe<Scalars['String']>;
  EventTypeNameEn?: Maybe<Scalars['String']>;
  EventTypeNameFr?: Maybe<Scalars['String']>;
  InterventionEventId?: Maybe<Scalars['Int']>;
  MeetingNumber?: Maybe<Scalars['String']>;
  ParliamentNumber?: Maybe<Scalars['Int']>;
  PersonId?: Maybe<Scalars['Int']>;
  PersonMiddleName?: Maybe<Scalars['String']>;
  PersonName?: Maybe<Scalars['String']>;
  PersonOfficialFirstName?: Maybe<Scalars['String']>;
  PersonOfficialLastName?: Maybe<Scalars['String']>;
  SenateSystemAffiliationId?: Maybe<Scalars['Int']>;
  SessionNumber?: Maybe<Scalars['Int']>;
  SpeechDateTime?: Maybe<Scalars['String']>;
  Url?: Maybe<Scalars['String']>;
  UrlEn?: Maybe<Scalars['String']>;
  UrlFr?: Maybe<Scalars['String']>;
};

export type IUser = {
  __typename?: 'IUser';
  address?: Maybe<Scalars['String']>;
  bills?: Maybe<Array<Maybe<Scalars['String']>>>;
  categories?: Maybe<Array<Maybe<EBillCategories>>>;
  city?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  emailNotification?: Maybe<Scalars['Boolean']>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  mp?: Maybe<Scalars['String']>;
  party?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  ridingName?: Maybe<Scalars['String']>;
  smsNotification?: Maybe<Scalars['Boolean']>;
  street?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type IVoteDetails = {
  __typename?: 'IVoteDetails';
  BillDocumentId?: Maybe<Scalars['Int']>;
  DecisionDateTime?: Maybe<Scalars['String']>;
  DecisionResultId?: Maybe<Scalars['Int']>;
  DecisionResultName?: Maybe<Scalars['String']>;
  DecisionResultNameEn?: Maybe<Scalars['String']>;
  DecisionResultNameFr?: Maybe<Scalars['String']>;
  DivisionNumber?: Maybe<Scalars['Int']>;
  DivisionSubject?: Maybe<Scalars['String']>;
  DivisionSubjectEn?: Maybe<Scalars['String']>;
  DivisionSubjectFr?: Maybe<Scalars['String']>;
  DivisionVotePaired?: Maybe<Scalars['Int']>;
  DivisionVoteTotal?: Maybe<Scalars['Int']>;
  DivisionVotesNays?: Maybe<Scalars['Int']>;
  DivisionVotesYeas?: Maybe<Scalars['Int']>;
  IsAgreedTo?: Maybe<Scalars['Boolean']>;
  IsNegatived?: Maybe<Scalars['Boolean']>;
  IsTied?: Maybe<Scalars['Boolean']>;
  OrganizationId?: Maybe<Scalars['Int']>;
};

export type IWebReference = {
  __typename?: 'IWebReference';
  BillDocumentId: Scalars['ID'];
  Title?: Maybe<Scalars['String']>;
  TitleEn?: Maybe<Scalars['String']>;
  TitleFr?: Maybe<Scalars['String']>;
  Url?: Maybe<Scalars['String']>;
  UrlEn?: Maybe<Scalars['String']>;
  UrlFr?: Maybe<Scalars['String']>;
  WebReferenceTypeId?: Maybe<Scalars['Int']>;
  WebReferenceTypeName?: Maybe<Scalars['String']>;
  WebReferenceTypeNameEn?: Maybe<Scalars['String']>;
  WebReferenceTypeNameFr?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addUserBill?: Maybe<IUser>;
  addUserCategory?: Maybe<IUser>;
  removeUserBill?: Maybe<IUser>;
  removeUserCategory?: Maybe<IUser>;
};


export type MutationaddUserBillArgs = {
  billCode: Scalars['String'];
};


export type MutationaddUserCategoryArgs = {
  category: EBillCategories;
};


export type MutationremoveUserBillArgs = {
  billCode: Scalars['String'];
};


export type MutationremoveUserCategoryArgs = {
  category: EBillCategories;
};

export type PGeocodeQuery = {
  city: Scalars['String'];
  province: EProvinceCodes;
  street: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  fetchMpInfo?: Maybe<IMemberOfParliament>;
  getAllBills?: Maybe<Array<Maybe<IBill>>>;
  getOneBill?: Maybe<IBill>;
  getOneUser?: Maybe<IUser>;
};


export type QueryfetchMpInfoArgs = {
  query: PGeocodeQuery;
};


export type QuerygetOneBillArgs = {
  code: Scalars['String'];
};
