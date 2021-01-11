import Axios, { AxiosResponse } from "axios";
import Cheerio from "cheerio";
import { parseString } from "xml2js";

import { BaseService } from "../base-service";

import { Bill, createBill } from "../bills";
import { Event } from "../events";
import { FormatUtils } from "@utils";

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

  async splitBillsAndEvents(
    billEventsArray: BillEvent[],
  ): Promise<{ billsArray: Bill[]; eventsArray: Event[] }> {
    const billsArray: Bill[] = [];
    const eventsArray: Event[] = [];

    const sortedBillEventsArray = this.sortBillEventsByDate(billEventsArray);
    const billCodes: string[] = await super.findAllValues({
      table: "bills",
      column: "code",
    });
    const events: Event[] = await super.findAll("events");

    for await (const billEvent of sortedBillEventsArray) {
      const code = FormatUtils.formatCode(billEvent.description);
      const eventTitle = FormatUtils.formatTitle(billEvent.title);

      const newBill = !!(
        !billsArray.some((savedBill) => savedBill.code === code) &&
        !billCodes.includes(code)
      );
      if (newBill) {
        const bill = await createBill(billEvent);
        billsArray.push(bill);
        console.log(
          `Successfuly fetched Bill ${bill.code} from LEGISinfo server ...`,
        );
      }

      const newEvent = !events.some(
        (savedEvent) =>
          savedEvent.bill_code === code && savedEvent.title === eventTitle,
      );
      if (newEvent) {
        const event = new Event(billEvent);
        eventsArray.push(event);
        console.log(
          `Successfully fetched ${event.title} for Bill ${event.bill_code} from LEGISinfo server ...`,
        );
      }
    }

    return { billsArray, eventsArray };
  }

  getLegisInfoCaller = async (
    url: string,
  ): Promise<{ billsArray: Bill[]; eventsArray: Event[] }> => {
    try {
      const xml = await this.fetchXml(url);
      const sourceArray = await FormatUtils.formatXml<BillEvent>(xml);

      return await this.splitBillsAndEvents(sourceArray);
    } catch (error) {
      throw new Error(`[LEGISINFO CALLER ERROR] ${error}`);
    }
  };

  private sortBillEventsByDate(billEventsArray: BillEvent[]): BillEvent[] {
    return billEventsArray.sort((a, b) =>
      !!(!!a.pubDate && !!b.pubDate) && a.pubDate < b.pubDate ? 1 : -1,
    );
  }
}
