import Axios, { AxiosResponse } from "axios";
import Cheerio from "cheerio";
import { parseString } from "xml2js";

import { BaseService } from "../base-service";

import { Bill } from "../bills";
import { Event } from "../events";
import { FormatUtils } from "@utils";

interface FetchPageParams {
  pageUrl: string;
  billCode: string;
}

export class WebService extends BaseService<any> {
  // Returns the XML document from a given URL
  async fetchXml(url: string): Promise<string> {
    try {
      const { data: xml }: AxiosResponse<string> = await Axios.get(url);
      return xml;
    } catch (error) {
      throw new Error(`[WEB SERVICE ERROR]: fetchXml: ${error}`);
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

      const introducedDate: string | undefined = introducedDateFetch
        ? introducedDateFetch
        : undefined;

      !introducedDate &&
        console.log(
          `No introduced date available for Bill ${billCode}. Skipping ...`,
        );

      return introducedDate;
    } catch (error) {
      console.error(
        `[WEB SERVICE ERROR]: fetchIntroducedDate - Bill ${billCode}: ${error}`,
      );
      return undefined;
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
      const decription: string | undefined = summaryDiv
        ? summaryDiv.replace(/\s+/g, " ").trim()
        : undefined;

      return decription;
    } catch (error) {
      console.error(
        `[WEB SERVICE ERROR]: fetchDescription - Bill ${billCode}: ${error}`,
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

      if (fullTextXml) {
        const fullTextRaw: string = Cheerio.load(fullTextXml)("text").text();
        return fullTextRaw;
      }
    } catch (error) {
      console.error(`An error occurred while fetching raw full text: ${error}`);
    }
  }

  // Returns the array of legislative summaries of bills from the parliament website
  async fetchSummaryUrls(summariesUrl: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.fetchXml(summariesUrl)
        .then((xml) => {
          if (xml) {
            parseString(xml, (error: Error, response: string) => {
              if (!error) {
                const xmlObject: {
                  rss: { channel: { item: string[] }[] };
                } = JSON.parse(JSON.stringify(response));
                const summariesArray = xmlObject?.rss?.channel[0]?.item;

                summariesArray ? resolve(summariesArray) : resolve([]);
              } else if (error) {
                reject(`[WEB SERVICE ERROR - fetchSummaryUrls ] ${error}`);
              }
            });
          } else {
            reject(
              `[WEB SERVICE ERROR - fetchSummaryUrls ] Unable to fetch XML for legislative summaries.`,
            );
          }
        })
        .catch((error) => {
          reject(`[WEB SERVICE ERROR - fetchSummaryUrls ] ${error}`);
        });
    });
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
      const description = fullTextUrl
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
    } catch (error) {
      console.error(`[WEB SERVICE ERROR]: insertFetchedDataIntoBill: ${error}`);
      return bill;
    }
  }

  // Inserts all fetched data into bills and returns updated bills sorted by introduced_date
  async returnFormattedBills(bills: Bill[]): Promise<Bill[]> {
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
    } catch (error) {
      throw new Error(`[WEB SERVICE ERROR]: Error return${error}`);
    }
  }

  async splitBillsAndEvents(
    combinedArray: [],
  ): Promise<{ billsArray: Bill[]; eventsArray: Event[] }> {
    const billsArray: Bill[] = [];
    const eventsArray: Event[] = [];

    for (const combinedBillEvent of combinedArray) {
      const billCode = FormatUtils.formatCode(combinedBillEvent.description[0]);
      const eventTitle = FormatUtils.formatTitle(combinedBillEvent.title);

      const bill: Bill = {
        id: "",
        parliamentary_session_id: undefined,
        code: billCode,
        title: FormatUtils.formatTitle(combinedBillEvent.description),
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
        where: { code: billCode },
      });
      const eventExistsInDb = await super.findIfRowExists({
        table: "events",
        where: [{ bill_code: billCode }, { title: eventTitle }],
      });

      if (!billExistsInArray && !billExistsinDb) {
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

  // Splits out the code of the bill from each legislative summary in the array
  // Returns an array of summary objects containing only the bill code and summary url
  splitSummaries(
    fetchedSummaryArray: { title: string; link: string }[],
  ): BillSummaryMap[] {
    const summariesArray: BillSummaryMap[] = [];

    fetchedSummaryArray.forEach((summary) => {
      if (summary.title.includes("Legislative Summary Published for ")) {
        const summaryBillCode = summary.title
          .split("Legislative Summary Published for ")[1]
          .split(",")[0];

        const summaryObject: BillSummaryMap = {
          code: summaryBillCode,
          url: summary.link,
        };

        summariesArray.push(summaryObject);
      }
    });

    return summariesArray;
  }

  getLegisInfoCaller = async (
    url: string,
  ): Promise<{ formattedBillsArray: Bill[]; eventsArray: Event[] }> => {
    try {
      const xml = await this.fetchXml(url);

      const sourceArray = await FormatUtils.formatXml(xml);

      const { billsArray, eventsArray } = await this.splitBillsAndEvents(
        sourceArray,
      );
      const formattedBillsArray: Bill[] = await this.returnFormattedBills(
        billsArray,
      );

      console.log(
        `Succesfully fetched ${formattedBillsArray.length} bills and ${eventsArray.length} events ...\n`,
      );

      return { formattedBillsArray, eventsArray };
    } catch (error) {
      console.error(`[LEGISINFO CALLER ERROR] ${error}`);
      throw new Error(`[LEGISINFO CALLER ERROR] ${error}`);
    }
  };
}
