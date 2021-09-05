import Axios, { AxiosResponse } from "axios";
import Cheerio from "cheerio";

import { FormatUtils } from "@utils";

export interface IBill {
  code: string;
  title: string;
  page_url: string;
  categories: EBillCategories[];
  id?: string;
  parliamentary_session_id?: string;
  description?: string;
  introduced_date?: string;
  summary_url?: string | null;
  full_text_url?: string | null;
  passed?: boolean | null;
  createdAt?: Date;
}

export class Bill implements IBill {
  code: string;
  title: string;
  page_url: string;
  categories: EBillCategories[];
  id?: string;
  parliamentary_session_id?: string;
  description?: string;
  introduced_date?: string;
  summary_url?: string | null;
  full_text_url?: string | null;
  passed?: boolean | null;
  createdAt?: Date;

  constructor({
    code,
    title,
    page_url,
    categories,
    id,
    parliamentary_session_id,
    description,
    introduced_date,
    summary_url,
    full_text_url,
    passed,
    createdAt,
  }: BillInput) {
    this.id = id;
    this.code = code;
    this.title = title;
    this.page_url = page_url;
    this.categories = categories;
    this.parliamentary_session_id = parliamentary_session_id;
    this.description = description;
    this.introduced_date = introduced_date;
    this.summary_url = summary_url;
    this.full_text_url = full_text_url;
    this.passed = passed;
    this.createdAt = createdAt;
  }
}

export class BillInput implements IBill {
  code: string;
  title: string;
  page_url: string;
  categories: EBillCategories[];
  id?: string;
  parliamentary_session_id?: string;
  description?: string;
  introduced_date?: string;
  summary_url?: string | null;
  full_text_url?: string | null;
  passed?: boolean | null;
  createdAt?: Date;

  constructor({ link, description }: PBillEvent) {
    this.code = FormatUtils.formatCode(description);
    this.title = FormatUtils.formatTitle(description);
    this.page_url = link;
    this.summary_url = null;
    this.full_text_url = null;
    this.passed = null;
    this.categories = [];
  }

  // Performs all sync operations needed to initialize a new Bill from the Legisinfo data
  async insertFetchedValues(
    pageUrl: string,
    billCode: string,
    pSessionId: string,
  ) {
    this.parliamentary_session_id = pSessionId;
    this.introduced_date = await this.fetchIntroducedDate({
      pageUrl,
      billCode,
    });
    const fullTextUrl = await this.fetchFullTextUrl({ pageUrl, billCode });
    this.full_text_url = fullTextUrl;
    this.description = fullTextUrl
      ? await this.fetchDescription({ pageUrl: fullTextUrl, billCode })
      : undefined;
  }

  // Returns the date that a bill was introduced from a bill page
  private async fetchIntroducedDate({
    pageUrl,
    billCode,
  }: FetchPageParams): Promise<string | undefined> {
    let introducedDate: string | undefined;

    try {
      const { data }: AxiosResponse<string> = await Axios.get(pageUrl);
      const billPage: cheerio.Root = Cheerio.load(data);

      const billReinstated = billPage(
        'a:contains("Reinstated from previous session")',
      )?.attr("href");

      if (billReinstated) {
        introducedDate = await this.fetchIntroducedDate({
          pageUrl: `https://www.parl.ca/LegisInfo/${billReinstated}`,
          billCode,
        });
      } else {
        const variantOne = billPage('span:contains("House of Commons")')
          .parentsUntil("li")
          .find('div.HouseShadeLevel:contains("First Reading")')
          .parent()
          .find("span");
        const variantTwo = billPage('span:contains("House of Commons")')
          .parentsUntil("ul")
          .find('div.HouseShadeLevel:contains("First Reading")')
          .last()
          .parent()
          .parent()
          .find("span");
        const variantThree = billPage(
          'div.MajorStage:contains("First Reading")',
        )
          .parent()
          .find("div.StatusCol2")
          .find("span");

        introducedDate = (
          variantOne.text() ||
          variantTwo.text() ||
          variantThree.text()
        ).substring(0, 10);

        !introducedDate &&
          console.log(
            `No introduced date available for Bill ${billCode}. Skipping ...`,
          );
      }

      return introducedDate
        ? FormatUtils.formatDate(introducedDate)
        : undefined;
    } catch (error) {
      console.error(
        `[WEB SERVICE ERROR]: fetchIntroducedDate - Bill ${billCode}: ${error}`,
      );
      return undefined;
    }
  }

  // Returns the latest full text URL from a bill page
  private async fetchFullTextUrl({
    pageUrl,
    billCode,
  }: FetchPageParams): Promise<string | undefined> {
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
        `[WEB SERVICE ERROR]: fetchFullTextUrl - Bill ${billCode}: ${error}`,
      );
    }
  }

  // Returns the description from the summary of the full text of a given bill
  private async fetchDescription({
    pageUrl,
    billCode,
  }: FetchPageParams): Promise<string | undefined> {
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
        `[WEB SERVICE ERROR]: fetchDescription - Bill ${billCode}: ${error}`,
      );
    }
  }
}

export async function createBill(
  billEvent: PBillEvent,
  pSessionId: string,
): Promise<Bill> {
  const newBillInput = new BillInput(billEvent);
  await newBillInput.insertFetchedValues(
    newBillInput.page_url,
    newBillInput.code,
    pSessionId,
  );

  return new Bill(newBillInput);
}
