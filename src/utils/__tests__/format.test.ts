import { PBillEvent } from "../../types";
import { FormatUtils } from "../../utils";

describe(`FormatUtils methods`, () => {
  describe("formatSummariesXml", () => {
    const testString = `<?xml version="1.0" encoding="utf-8"?><rss version="2.0"><channel><title>Custom RSS Feed</title><language>en</language><description>Custom RSS Feed/Fil RSS personnalisé</description><link>https://www.parl.ca/LegisInfo/</link><atom:link href="https://www.parl.ca/LegisInfo/RSSFeed.aspx?download=rss&amp;Language=E&amp;Mode=1&amp;Source=LegislativeFilteredBills&amp;AllBills=1&amp;HOCEventTypes=60110,60111,60146,60306,60122,60115,60119,60121,60124,60125,60126,60127,60285,60145,60307,60128,60131,60132,60133,60134,60174,60112,60163,60304,60303,60139,60144,60136,60138,60142&amp;SenateEventTypes=60109,60110,60111,60115,60118,60119,60120,60123,60124,60305,60286,60130,60129,60302,60131,60132,60133,60134,60147,60304,60303,60140,60143,60135,60137,60141,60149" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom" /><item><title>C-8, Introduction and First Reading in the House of Commons</title><link>https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&amp;billId=10686845</link><description>C-8, An Act to amend the Criminal Code (conversion therapy)</description><pubDate>Mon, 09 Mar 2020 00:00:00 EST</pubDate></item><item><title>C-237, Placed in the Order of Precedence in the House of Commons</title><link>https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&amp;billId=10660264</link><description>C-237, An Act to establish a national framework for diabetes</description><pubDate>Thu, 05 Mar 2020 00:00:00 EST</pubDate></item></channel></rss>`;
    const invalidXml =
      '<?xml version="1.0" encoding="utf-8"?><rss version="2.0"><channel><title>Custom RSS Feed';

    it("Should return an array", async () => {
      const formattedXml = await FormatUtils.formatSummariesXml<PBillEvent>(testString);

      expect(formattedXml).toBeInstanceOf(Array);
      formattedXml.forEach((billEvent) => {
        expect(billEvent).toBeInstanceOf(Object);
        for (const property in billEvent) {
          expect(typeof billEvent[property]).toEqual("string");
        }
      });
    });

    it("Should return an array with length equal to number of bills", async () => {
      const formattedXml = await FormatUtils.formatSummariesXml<PBillEvent>(testString);
      expect(formattedXml).toHaveLength(2);
    });

    it("Throws if given invalid xml", async () => {
      try {
        await FormatUtils.formatSummariesXml<PBillEvent>(invalidXml);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  // describe("formatDate", () => {
  //   const testBill = {
  //     title: "C-9, Introduction and First Reading in the House of Commons",
  //     link: "https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10686850",
  //     description: "C-9, An Act to amend the Chemical Weapons Convention Implementation Act",
  //     pubDate: "Tue, 10 Mar 2020 00:00:00 EST",
  //   };

  //   it("Should format date", () => {
  //     expect(FormatUtils.formatDate(testBill.pubDate)).toBe("2020/03/10");
  //   });

  //   it("Should return undefined if passed an invalid date", () => {
  //     expect(FormatUtils.formatDate("this is not a date")).toBe(undefined);
  //   });
  // });
});
