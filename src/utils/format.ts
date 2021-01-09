import { parseString } from "xml2js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export class FormatUtils {
  // Returns the parsed array of bills/events from the source XML (with redundant tags removed)
  static formatXml = async (xml: string): Promise<BillEvent[]> => {
    try {
      return await new Promise((resolve, reject) => {
        parseString(xml, (error: Error, response: string) => {
          if (!error) {
            const xmlObject: {
              rss: { channel: { item: BillEvent[] }[] };
            } = JSON.parse(JSON.stringify(response));
            const fetchedArray = xmlObject.rss.channel[0].item;

            fetchedArray.length ? resolve(fetchedArray) : resolve([]);
          } else if (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      throw new Error(`[FORMAT XML ERROR]: ${error}`);
    }
  };

  // Formats the fetched dates to a consistent format
  static formatDate = (date: string): string =>
    dayjs(date).utcOffset(-4).format(`YYYY/MM/DD`);

  // Returns a bill's code from the 'description' field
  static formatCode = (description: string): string =>
    description.toString().substr(0, description.indexOf(","));

  // Returns the title of a bill or event from the 'description' or 'title' field
  static formatTitle = (title: string): string =>
    title.toString().split(/, (.+)/)[1];
}
