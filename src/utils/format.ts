import { parseString } from "xml2js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export class FormatUtils {
  // Returns the parsed array of bills/events from the source XML (with redundant tags removed)
  static formatXml = async (xml: string): Promise<string[] | undefined> => {
    try {
      return await new Promise((resolve, _reject) => {
        parseString(xml, (err: Error, response: string) => {
          if (!err) {
            const xmlObject: {
              rss: { channel: { item: string[] }[] };
            } = JSON.parse(JSON.stringify(response));
            const fetchedArray = xmlObject.rss.channel[0].item;

            !!fetchedArray ? resolve(fetchedArray) : resolve(undefined);
          } else if (!!err) {
            resolve(undefined);
          }
        });
      });
    } catch (err) {
      throw new Error(`[FORMAT XML ERROR]: ${err}`);
    }
  };

  // Formats the fetched dates to a consistent format
  static formatDate = (date: string): string =>
    dayjs(date).utcOffset(-4).format(`YYYY/MM/DD`);

  // Returns a bill's code from the 'description' field
  static formatCode = (description: string): string =>
    description.substr(0, description.indexOf(","));

  // Returns the title of a bill or event from the 'description' or 'title' field
  static formatTitle = (title: string): string => title.split(/, (.+)/)[1];
}
