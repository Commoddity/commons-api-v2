import Axios, { AxiosResponse } from "axios";
import Cheerio from "cheerio";

import { FormatUtils } from "@utils";
import { ParliamentsService } from "../parliaments";

export interface BillInterface {
  code: string;
  title: string;
  page_url: string;
  id?: string;
  parliamentary_session_id?: number;
  description?: string;
  introduced_date?: string;
  summary_url?: string;
  full_text_url?: string;
  passed?: boolean;
  created_at?: Date;
}

export class Bill implements BillInterface {
  code: string;
  title: string;
  page_url: string;
  id?: string;
  parliamentary_session_id?: number;
  description?: string;
  introduced_date?: string;
  summary_url?: string;
  full_text_url?: string;
  passed?: boolean;
  created_at?: Date;

  constructor({ link, description }: BillEvent) {
    this.code = FormatUtils.formatCode(description);
    this.title = FormatUtils.formatTitle(description);
    this.page_url = link;
    this.summary_url = undefined;
    this.passed = undefined;
  }

  // Performs all sync operations needed to initialize a new Bill from the Legisinfo data
  async insertFetchedValues(pageUrl: string, billCode: string) {
    this.parliamentary_session_id =
      (await new ParliamentsService().queryLatestParliamentarySession()) || 0;
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

export async function createBill(billEvent: BillEvent): Promise<Bill> {
  const NewBill = new Bill(billEvent);
  await NewBill.insertFetchedValues(NewBill.page_url, NewBill.code);
  return NewBill;
}
