import Axios, { AxiosResponse } from "axios";
import Cheerio from "cheerio";
import { parseString } from "xml2js";

import { BaseService } from "../base-service";

import { Bill } from "../bills";
import { Event } from "../events";
import { BillEvent } from "@types";
import { FormatUtils } from "@utils";

interface FetchPageParams {
  pageUrl: string;
  billCode: string;
}

export class WebService extends BaseService<any> {
  // Returns the XML document from a given URL
  async fetchXml(url: string): Promise<string | undefined> {
    try {
      const { data: xml }: AxiosResponse<string> = await Axios.get(url);
      return xml;
    } catch (err) {
      console.error(`[WEB SERVICE ERROR]: fetchXml: ${err}`);
    }
  }

  // Returns the latest full text URL from a bill page
  async fetchFullTextUrl({
    pageUrl,
    billCode,
  }: FetchPageParams): Promise<string | undefined> {
    try {
      const { data }: AxiosResponse<string> = await Axios.get(pageUrl);
      const billPage: cheerio.Root = Cheerio.load(data);
      const link: string | undefined = billPage(
        'a:contains("Latest Publication")',
      ).attr("href");

      const fullTextUrl: string | undefined = !!link
        ? `https:${link}`
        : undefined;

      !link &&
        console.log(
          `No full text available for Bill ${billCode}. Skipping ...`,
        );

      return fullTextUrl;
    } catch (err) {
      console.error(
        `[WEB SERVICE ERROR]: fetchFullTextUrl - Bill ${billCode}: ${err}`,
      );
    }
  }

  // Returns the date that a bill was introduced from a bill page
  async fetchIntroducedDate({
    pageUrl,
    billCode,
  }: FetchPageParams): Promise<string | undefined> {
    try {
      const { data }: AxiosResponse<string> = await Axios.get(pageUrl);
      const billPage: cheerio.Root = Cheerio.load(data);
      const introducedDateFetch: string = billPage(
        'div:contains("Introduction and First Reading")',
      )
        .last()
        .parent()
        .parent()
        .find("span")
        .text();

      const introducedDate: string | undefined = !!introducedDateFetch
        ? introducedDateFetch
        : undefined;

      !introducedDate &&
        console.log(
          `No introduced date available for Bill ${billCode}. Skipping ...`,
        );

      return introducedDate;
    } catch (err) {
      console.error(
        `[WEB SERVICE ERROR]: fetchIntroducedDate - Bill ${billCode}: ${err}`,
      );
    }
  }

  // Returns the description from the summary of the full text of a given bill
  async fetchDescription({
    pageUrl,
    billCode,
  }: FetchPageParams): Promise<string | undefined> {
    try {
      const response: AxiosResponse<string> = await Axios.get(pageUrl);
      const billPage: cheerio.Root = Cheerio.load(response.data);
      const summaryDiv: string = billPage('div:contains("This enactment")')
        .last()
        .text();

      // Regex removes trailing space and newline characters
      const decription: string | undefined = !!summaryDiv
        ? summaryDiv.replace(/\s+/g, " ").trim()
        : undefined;

      return decription;
    } catch (err) {
      console.error(
        `[WEB SERVICE ERROR]: fetchDescription - Bill ${billCode}: ${err}`,
      );
    }
  }

  // Returns the raw text from the XML bill, in other words all text within <Text> tags
  async fetchFullText(fullTextUrl: string): Promise<string | undefined> {
    try {
      const response: AxiosResponse<string> = await Axios.get(fullTextUrl);
      const fullTextPage: cheerio.Root = Cheerio.load(response.data);
      const xmlPageLink = fullTextPage('a.btn-export-xml:contains("XML")').attr(
        "href",
      );
      const fullTextUrlJoined = `https://www.parl.ca${xmlPageLink}`;

      const fullTextXml = await this.fetchXml(fullTextUrlJoined);

      if (!!fullTextXml) {
        const fullTextRaw: string = Cheerio.load(fullTextXml)("text").text();
        return fullTextRaw;
      }
    } catch (err) {
      console.error(`An error occurred while fetching raw full text: ${err}`);
    }
  }

  // Returns the array of legislative summaries of bills from the parliament website
  async fetchSummaryUrls(summariesUrl: string): Promise<string[] | undefined> {
    try {
      const xml: string | undefined = await this.fetchXml(summariesUrl);

      if (!!xml) {
        return await new Promise((resolve, reject) => {
          parseString(xml, (err: Error, response: string) => {
            if (!err) {
              const xmlObject: {
                rss: { channel: { item: string[] }[] };
              } = JSON.parse(JSON.stringify(response));
              const summariesArray = xmlObject?.rss?.channel[0]?.item;

              !!summariesArray ? resolve(summariesArray) : resolve(undefined);
            } else if (!!err) {
              resolve(undefined);
            }
          });
        });
      }
    } catch (err) {
      console.error(`[WEB SERVICE ERROR]: fetchSummaryUrls: ${err}`);
    }
  }

  // Fetches full text URL, introduced date and description via web scraping
  // Inserts values into each bill objects and returns the updated object
  async insertFetchedDataIntoBill(bill: Bill): Promise<Bill> {
    try {
      const fullTextUrl = await this.fetchFullTextUrl({
        pageUrl: bill.page_url,
        billCode: bill.code,
      });
      const introducedDate = await this.fetchIntroducedDate({
        pageUrl: bill.page_url,
        billCode: bill.code,
      });
      const description = !!fullTextUrl
        ? await this.fetchDescription({
            pageUrl: fullTextUrl,
            billCode: bill.code,
          })
        : undefined;

      bill.full_text_url = fullTextUrl;
      bill.introduced_date = introducedDate
        ? FormatUtils.formatDate(introducedDate)
        : undefined;
      bill.description = description;

      return bill;
    } catch (err) {
      console.error(`[WEB SERVICE ERROR]: insertFetchedDataIntoBill: ${err}`);
      return bill;
    }
  }

  // Inserts all fetched data into bills and returns updated bills sorted by introduced_date
  async returnFormattedBills(bills: Bill[]): Promise<Bill[] | undefined> {
    try {
      // Creates an array of Promises to format all bills with fetched data
      const promises: Promise<Bill>[] = bills.map((bill) =>
        this.insertFetchedDataIntoBill(bill),
      );

      // Resolve promises array into new array of formatted bills
      const formattedBills: Bill[] = await Promise.all(promises);
      return formattedBills.sort((a, b) =>
        !!(!!a.introduced_date && !!b.introduced_date) &&
        a.introduced_date < b.introduced_date
          ? 1
          : -1,
      );
    } catch (err) {
      console.error(`[WEB SERVICE ERROR]: Error return${err}`);
    }
  }

  async splitBillsAndEvents(
    combinedArray: BillEvent[],
  ): Promise<{ billsArray: Bill[]; eventsArray: Event[] }> {
    const billsArray: Bill[] = [];
    const eventsArray: Event[] = [];

    for (const combinedBillEvent of combinedArray) {
      const billCode = FormatUtils.formatCode(combinedBillEvent.description!);
      const eventTitle = FormatUtils.formatTitle(combinedBillEvent.title);

      const bill: Bill = {
        id: "",
        parliamentary_session_id: undefined,
        code: billCode,
        title: FormatUtils.formatTitle(combinedBillEvent.description!),
        description: undefined,
        introduced_date: undefined,
        summary_url: undefined,
        page_url: combinedBillEvent.link,
        full_text_url: undefined,
        passed: undefined,
      };

      const event: Event = {
        id: "",
        bill_code: billCode,
        title: eventTitle,
        publication_date: FormatUtils.formatDate(combinedBillEvent.pubDate),
      };

      const billExistsInArray = billsArray.some(
        (savedBill) => savedBill.code === bill.code,
      );
      const billExistsinDb = await super.findIfRowExists({
        table: "bills",
        where: { column: "code", value: billCode },
      });
      const eventExistsInDb = await super.findIfRowExists({
        table: "events",
        where: [
          { column: "bill_code", value: billCode },
          { column: "title", value: eventTitle },
        ],
      });

      if (!!(!billExistsInArray && !billExistsinDb)) {
        console.log(
          `Successfuly fetched Bill ${bill.code} from LEGISinfo server ...`,
        );
        billsArray.push(bill);
      }
      if (!eventExistsInDb) {
        eventsArray.push(event);
        console.log(
          `Successfully fetched ${event.title} for Bill ${event.bill_code} from LEGISinfo server ...`,
        );
      }
    }

    return { billsArray, eventsArray };
  }
}
