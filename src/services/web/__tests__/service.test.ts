import { WebService } from "../../web";

describe(`WebService methods`, () => {
  const testWebService = new WebService();
  const ProtoWebService = Object.getPrototypeOf(testWebService);

  describe("fetchXml", () => {
    const testUrl =
      "https://www.parl.ca/LegisInfo/RSSFeed.aspx?download=rss&Language=E&Mode=1&Source=LegislativeFilteredBills&AllBills=1&HOCEventTypes=60110,60111,60146,60306,60122,60115,60119,60121,60124,60125,60126,60127,60285,60145,60307,60128,60131,60132,60133,60134,60174,60112,60163,60304,60303,60139,60144,60136,60138,60142&SenateEventTypes=60109,60110,60111,60115,60118,60119,60120,60123,60124,60305,60286,60130,60129,60302,60131,60132,60133,60134,60147,60304,60303,60140,60143,60135,60137,60141,60149";

    it("Fetchs an XML string from a URL", async () => {
      const xmlResponse = await ProtoWebService.fetchXml(testUrl);

      expect(typeof xmlResponse).toBe("string");
    });
  });

  describe("fetchFullText", () => {
    const testFullTextUrl = "https://parl.ca/DocumentViewer/en/10624785";
    const testfullTextRaw =
      "This enactment provides for the development of a national school food program to ensure that all children in Canada have access to healthy food.Whereas more than four million Canadians, including one and a half million children, live in a home where the family reports struggling with food insecurity;Whereas it is important to the health and development of children that they have access to healthy food, particularly in a school setting;Whereas Canada is one of the few member countries of the Organisation for Economic Co-operation and Development without a national school food program in place;Whereas UNICEF’s 2017 Innocenti Report Card 14 on child well-being in the context of sustainable de­velopment across 41 high-income countries ranked Canada 37th on achieving Goal 2, entitled “End hunger, achieve food security and improved nutrition and promote sustainable agriculture”;And whereas the Parliament of Canada recognizes that education and health are provincial matters and that developing a national school food program for children will require the collaboration of all provinces;Now, therefore, Her Majesty, by and with the advice and consent of the Senate and House of Commons of Canada, enacts as follows:This Act may be cited as the School Food Program for Children Act.The Minister of Health must, in consultation with the representatives of the provincial governments respon­sible for health and education and with other relevant stakeholders in those fields, develop a school food program to ensure that all children in Canada have access to healthy food. The program must, among other things,set out the criteria for determining whether a food is healthy, taking into account Canada’s Food Guide; include an assessment of whether the federal government should establish a grant program to fund the school food program and provide for cost-sharing arrangements with the provinces to ensure that the school food program is established and operates at little or no direct cost to children or their families;build on existing school food programs across Canada and use best practices from other jurisdictions; andpromote evidence-based healthy food education in schools across Canada.Within one year after the day on which this Act comes into force, the Minister of Health must prepare a report setting out the school food program and cause the report to be tabled before each House of Parliament on any of the first 15 days on which that House is sitting after the report is completed.The Minister must post the report on the website of the Department of Health within 10 days after the report has been tabled in both Houses of Parliament.Within five years after the tabling of the report referred to in section 3, the Minister of Health must undertake a review of the effectiveness of the program and prepare a report setting out his or her conclusions and recommendations regarding the program, and cause the report to be tabled before each House of Parliament on any of the first 15 days on which that House is sitting after the report is completed.The Minister must post the report on the website of the Department of Health within 10 days after the report has been tabled in both Houses of Parliament.";

    it("Fetches the raw full text of a bill if available", async () => {
      const testFullTextResponse = await ProtoWebService.fetchFullText(
        testFullTextUrl,
      );

      expect(typeof testFullTextResponse).toEqual("string");
    });

    it("Fetches the raw full text of a bill if available", async () => {
      const testFullTextResponse = await ProtoWebService.fetchFullText(
        testFullTextUrl,
      );

      expect(testFullTextResponse).toEqual(testfullTextRaw);
    });
  });
});
