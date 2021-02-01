import Axios, { AxiosResponse } from "axios";
import Cheerio from "cheerio";
import { BaseService, BillsService, EventsService } from "@services";
import { Bill, createBill } from "../bills";
import { Event } from "../events";
import { logs } from "./logs";
import { FormatUtils } from "@utils";

export class WebService extends BaseService<any> {
  // Returns the XML document from a given URL
  private async fetchXml(url: string): Promise<string> {
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

  // Splits out the code of the bill from each legislative summary in the array
  // Returns an array of summary objects containing only the bill code and summary url
  private splitSummaries(fetchedSummaryArray: BillSummary[]): BillSummaryMap[] {
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

  // Splits two arrays of Bills and Events from the fetched LEGISinfo XML data array.
  // Handles all the async detches needed to assemble the Bills and also avoid duplicates.
  private async splitBillsAndEvents(
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
          `[NEW BILL] Successfully fetched Bill ${bill.code} from LEGISinfo server ...`,
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
          `[NEW EVENT] Successfully fetched ${event.title} for Bill ${event.bill_code} from LEGISinfo server ...`,
        );
      }
    }

    return { billsArray, eventsArray };
  }

  private sortBillEventsByDate(billEventsArray: BillEvent[]): BillEvent[] {
    return billEventsArray.sort((a, b) =>
      !!(!!a.pubDate && !!b.pubDate) && a.pubDate < b.pubDate ? 1 : -1,
    );
  }

  private async getLegisInfoCaller(
    url: string,
  ): Promise<{ billsArray: Bill[]; eventsArray: Event[] }> {
    try {
      const xml = await this.fetchXml(url);
      const sourceArray = await FormatUtils.formatXml<BillEvent>(xml);

      return await this.splitBillsAndEvents(sourceArray);
    } catch (error) {
      throw new Error(`[LEGISINFO CALLER ERROR] ${error}`);
    }
  }

  private async getSummaries(): Promise<BillSummaryMap[]> {
    const summaryUrl = process.env.SUMMARY_URL!;

    try {
      const xml = await this.fetchXml(summaryUrl);
      const summariesArray = await FormatUtils.formatXml<BillSummary>(xml);

      return this.splitSummaries(summariesArray);
    } catch (error) {
      throw new Error(`[SUMMARIES FETCH ERROR] ${error}`);
    }
  }

  async updateBills(): Promise<boolean> {
    const legisInfoUrl = process.env.LEGISINFO_URL!;

    try {
      logs.started();

      const legisInfoData = await this.getLegisInfoCaller(legisInfoUrl);
      const { billsArray, eventsArray } = legisInfoData;

      logs.fetchedBills(billsArray.length, eventsArray.length);
      if (billsArray.length || eventsArray.length) logs.adding();

      if (billsArray.length) {
        const bills = await new BillsService().createManyBills(billsArray);
        logs.addedBills(bills.length);
      }

      if (eventsArray.length) {
        const events = await new EventsService().createManyEvents(eventsArray);
        logs.addedEvents(events.length);

        await new EventsService().updateBillsPassedStatus(eventsArray);
      }

      logs.summaryUpdate();
      const billSummaryMaps = await this.getSummaries();
      const summaries = await new BillsService().updateSummaryUrls(
        billSummaryMaps,
      );

      logs.success(billsArray.length, eventsArray.length, summaries);
      return true;
    } catch (error) {
      throw new Error(`[UPDATE DB SCRIPT ERROR]: ${error}`);
    }
  }
}
