import Axios, { AxiosResponse } from "axios";
import Cheerio from "cheerio";
import mongoose from "mongoose";

import { ParliamentsService } from "../../services";
import {
  EBillCategories,
  ERecordStatus,
  IArticleData,
  PBillEvent,
  PFetchPage,
} from "../../types";
import { FormatUtils } from "../../utils";

export enum EBillType {
  commons = "commons",
  senate = "senate",
}

export interface IBillEvent {
  eventId?: string;
  title: string;
  publicationDate: Date | undefined;
}

export class BillEvent implements IBillEvent {
  eventId?: string;
  title: string;
  publicationDate: Date | undefined;

  constructor({ title, pubDate }: PBillEvent) {
    this.title = FormatUtils.formatTitle(title);
    this.publicationDate = FormatUtils.formatDate(pubDate);
    this.eventId = new mongoose.Types.ObjectId().toString();
  }
}

export interface IBillMediaSource extends IArticleData {
  mbfcData: {
    biasRating: string;
    factualReporting: string;
    country: string;
    credibilityRating?: string;
    trafficPopularity?: string;
  };
  bpArticleRating: number;
}

export interface IBill {
  id?: string;
  code: string;
  title: string;
  pageUrl: string;
  categories: EBillCategories[];
  type: EBillType;
  parliamentarySessionId?: string;
  description?: string;
  introducedDate?: Date;
  passedDate?: Date;
  summaryUrl?: string | null;
  fullTextUrl?: string | null;
  passed?: boolean | null;
  events: BillEvent[];
  mediaSources?: IBillMediaSource[];
  createdAt?: Date;
  updatedAt?: Date;
  recordStatus?: ERecordStatus;
}

export class Bill implements IBill {
  id?: string;
  code: string;
  title: string;
  pageUrl: string;
  categories: EBillCategories[];
  type: EBillType;
  parliamentarySessionId?: string;
  description?: string;
  introducedDate?: Date;
  passedDate?: Date;
  summaryUrl?: string | null;
  fullTextUrl?: string | null;
  passed?: boolean | null;
  events: BillEvent[];
  mediaSources?: IBillMediaSource[];
  createdAt?: Date;
  updatedAt?: Date;
  recordStatus?: ERecordStatus;

  constructor({
    id,
    code,
    title,
    pageUrl,
    categories,
    type,
    parliamentarySessionId,
    description,
    introducedDate,
    passedDate,
    summaryUrl,
    fullTextUrl,
    passed,
    events,
    mediaSources,
    createdAt,
    updatedAt,
    recordStatus,
  }: BillInput) {
    this.id = id;
    this.code = code;
    this.title = title;
    this.pageUrl = pageUrl;
    this.categories = categories;
    this.type = type;
    this.parliamentarySessionId = parliamentarySessionId;
    this.description = description;
    this.introducedDate = introducedDate;
    this.passedDate = passedDate;
    this.summaryUrl = summaryUrl;
    this.fullTextUrl = fullTextUrl;
    this.passed = passed;
    this.events = events;
    this.mediaSources = mediaSources;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.recordStatus = recordStatus;
  }
}

export class BillInput implements IBill {
  id?: string;
  code: string;
  title: string;
  pageUrl: string;
  categories: EBillCategories[];
  type: EBillType;
  parliamentarySessionId?: string;
  description?: string;
  introducedDate?: Date;
  passedDate?: Date;
  summaryUrl?: string | null;
  fullTextUrl?: string | null;
  passed?: boolean | null;
  events: IBillEvent[];
  mediaSources?: IBillMediaSource[];
  createdAt?: Date;
  updatedAt?: Date;
  recordStatus?: ERecordStatus;

  constructor({ link, description }: PBillEvent) {
    this.code = FormatUtils.formatCode(description);
    this.title = FormatUtils.formatTitle(description);
    this.type = this.getBillType(description);
    this.pageUrl = link;
    this.summaryUrl = null;
    this.fullTextUrl = null;
    this.passed = null;
    this.mediaSources = [];
    this.events = [];
    this.categories = [];
  }

  private getBillType(description: string): EBillType {
    const prefix = description.slice(0, 1);
    return {
      C: EBillType.commons,
      S: EBillType.senate,
    }[prefix];
  }

  // Performs all sync operations needed to initialize a new Bill from the Legisinfo data
  async insertFetchedValues(pageUrl: string, billCode: string) {
    this.parliamentarySessionId = await this.getParliamentarySessionId(pageUrl);
    this.introducedDate = new Date(
      await this.fetchIntroducedDate({
        pageUrl,
        billCode,
      }),
    );
    const fullTextUrl = await this.fetchFullTextUrl({ pageUrl, billCode });
    this.fullTextUrl = fullTextUrl;
    this.description = fullTextUrl
      ? await this.fetchDescription({ pageUrl: fullTextUrl, billCode })
      : undefined;
  }

  private async getParliamentarySessionId(pageUrl: string): Promise<string> {
    const { data }: AxiosResponse<string> = await Axios.get(pageUrl);
    const billPage: cheerio.Root = Cheerio.load(data);

    const parliamentString = billPage(
      "#ctl00_ParlSessControl_lblParliamentSession",
    ).text();

    const parliamentNumber = Number(parliamentString.substring(0, 2));
    const sessionNumber = Number(parliamentString.substring(17, 18));
    const { parliamentarySessions } = await new ParliamentsService().findOne({
      number: parliamentNumber,
    });

    return parliamentarySessions.find(({ number }) => number === sessionNumber)
      .sessionId;
  }

  // Returns the date that a bill was introduced from a bill page
  private async fetchIntroducedDate({
    pageUrl,
    billCode,
  }: PFetchPage): Promise<Date | string | undefined> {
    let introducedDate: string | undefined;

    try {
      const { data }: AxiosResponse<string> = await Axios.get(pageUrl);
      const billPage: cheerio.Root = Cheerio.load(data);

      const billReinstated = billPage(
        'a:contains("Reinstated from previous session")',
      )?.attr("href");

      if (billReinstated) {
        introducedDate = (await this.fetchIntroducedDate({
          pageUrl: `https://www.parl.ca/LegisInfo/${billReinstated}`,
          billCode,
        })) as string;
      } else {
        const closestId = "#ctl00_PageContentSection_DetailsContainerPanel";
        introducedDate = billPage(closestId)
          .find("div.StatusTable")
          .find("span")
          .text()
          .substring(0, 10);
      }

      return introducedDate
        ? FormatUtils.formatDate(introducedDate)
        : undefined;
    } catch (error) {
      console.error(
        `[BILL CREATE ERROR]: fetchIntroducedDate - Bill ${billCode}: ${error}`,
      );
      return undefined;
    }
  }

  // Returns the latest full text URL from a bill page
  private async fetchFullTextUrl({
    pageUrl,
    billCode,
  }: PFetchPage): Promise<string | undefined> {
    try {
      const { data }: AxiosResponse<string> = await Axios.get(pageUrl);
      const billPage: cheerio.Root = Cheerio.load(data);
      const link: string | undefined = billPage(
        'a:contains("Latest Publication")',
      ).attr("href");

      const fullTextUrl: string | undefined = link
        ? `https:${link}`
        : undefined;

      !link &&
        console.log(
          `No full text available for Bill ${billCode}. Skipping ...`,
        );

      return fullTextUrl;
    } catch (error) {
      console.error(
        `[BILL CREATE ERROR]: fetchFullTextUrl - Bill ${billCode}: ${error}`,
      );
    }
  }

  // Returns the description from the summary of the full text of a given bill
  private async fetchDescription({
    pageUrl,
    billCode,
  }: PFetchPage): Promise<string | undefined> {
    try {
      const response: AxiosResponse<string> = await Axios.get(pageUrl);
      const billPage: cheerio.Root = Cheerio.load(response.data);

      const variantOne = billPage('h2:contains("SUMMARY")');
      const variantTwo = billPage('div:contains("SUMMARY")');

      const summaryDiv = (variantOne.text() ? variantOne : variantTwo.last())
        .parent()
        .parent()
        .parent()
        .text();

      // Regex removes trailing space and newline characters, as well as SUMMARY header
      const description = summaryDiv
        ?.replace(/\s+/g, " ")
        .replace(/RECOMMENDATION\s+/g, " ")
        .replace(/SUMMARY\s+/g, " ")
        .trim();

      return description;
    } catch (error) {
      console.error(
        `[BILL CREATE ERROR]: fetchDescription - Bill ${billCode}: ${error}`,
      );
    }
  }

  static async getPassedDate(pageUrl: string): Promise<Date | undefined> {
    try {
      const response: AxiosResponse<string> = await Axios.get(pageUrl);
      const billPage: cheerio.Root = Cheerio.load(response.data);

      const passedDate = billPage(
        "#ctl00_PageContentSection_LastStageEventDate",
      )
        .text()
        .replace(/([()])/g, "");

      return passedDate ? FormatUtils.formatDate(passedDate) : undefined;
    } catch (error) {
      console.error(`[BILL CREATE ERROR]: getPassedDate - ${error}`);
    }
  }
}

export async function createBill(billEvent: PBillEvent): Promise<Bill> {
  const newBillInput = new BillInput(billEvent);
  await newBillInput.insertFetchedValues(
    newBillInput.pageUrl,
    newBillInput.code,
  );

  return new Bill(newBillInput);
}
