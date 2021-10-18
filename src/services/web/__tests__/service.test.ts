import { initClient, closeDbConnection } from "../../../db";
import { WebService } from "../../web";
import { EProvinceCodes } from "../../../types";
import { wait } from "../../../utils";

beforeAll(async () => {
  await initClient();
});

afterAll(async () => {
  await closeDbConnection();
});

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
      const testFullTextResponse = await ProtoWebService.fetchFullText(testFullTextUrl);

      expect(typeof testFullTextResponse).toEqual("string");
    });

    it("Fetches the raw full text of a bill if available", async () => {
      const testFullTextResponse = await ProtoWebService.fetchFullText(testFullTextUrl);

      expect(testFullTextResponse).toEqual(testfullTextRaw);
    });
  });

  describe("fetchMpInfo", () => {
    it("Fetches a users MP info by address", async () => {
      const jennyKwan = await new WebService().fetchMpInfo({
        street: "2752 E Hastings St",
        city: "Vancouver",
        province: EProvinceCodes.BC,
      });

      expect(jennyKwan.name).toEqual("Jenny Kwan");
      expect(jennyKwan.party).toEqual("NDP");
      expect(jennyKwan.riding).toEqual("Vancouver East");
    });
  });

  const testUrls = [
    // "https://globalnews.ca/news/8257958/canadian-auto-production-semiconductor-shortage/",
    // "https://thetyee.ca/News/2021/09/15/Anjali-Appadurai-Campaign-New-Politics/",
    // "https://www.cbc.ca/news/business/covid-19-layoffs-1.6202871",
    // "https://www.rebelnews.com/trudeau_mandates_vaccines_for_planes_trains_disregards_natural_immunity",
    // "https://www.ctvnews.ca/canada/bring-our-canadians-home-lawyer-files-suit-on-behalf-of-26-canadians-stuck-in-syrian-camps-1.5619422",
    // "https://www.theglobeandmail.com/canada/alberta/article-prairies-record-countrys-highest-covid-19-death-rates/",
    // "https://nationalpost.com/news/politics/the-first-100-days-major-battle-over-free-speech-internet-regulation-looms-when-parliament-returns",
    // "https://rabble.ca/politics/world-politics/the-time-to-prohibit-nuclear-weapons-is-now/",
    // "https://www.nationalobserver.com/2021/10/08/news/meet-fossil-fuel-workers-pushing-energy-transition",
    // "https://thepostmillennial.com/biden-defends-jobs-report",
    // "https://ottawasun.com/news/local-news/in-a-sure-sign-of-fall-its-the-last-weekend-for-boaters-on-the-rideau-canal/wcm/687d282a-b74b-4ac0-83f2-92a8bcd9108d",
    // "https://calgarysun.com/news/local-news/alcohol-related-illnesses-in-alberta-surging-during-covid-19-pandemic/wcm/8a92e939-93f0-4ad5-9622-77bdd1d39ccf",
    // "https://www.thestar.com/news/canada/2021/10/11/vancouver-police-gang-task-force-arrest-alleged-top-six-gang-member.html",
    // "https://pressprogress.ca/doug-fords-government-quietly-cut-over-100-million-for-protecting-school-children-from-covid-19/",
    // "https://montrealgazette.com/news/local-news/unvaccinated-nurses-will-have-their-licenses-suspended-order-warns",
    // "https://thewalrus.ca/eating-dinner-with-canadas-migrant-workers/",
    // "https://www.canadaland.com/angela-rasmussen-origin-covid-19/",
    // "https://www.macleans.ca/politics/t%e1%b8%b1emlups-te-secwepemc-first-nation-is-not-interested-in-apologies/",
    // "https://ottawacitizen.com/news/world/canadian-david-card-among-three-nobel-prize-winners-for-economics/wcm/83a6c74c-fcda-44c9-9be2-fe4b81c4fd96",
    // "https://vancouversun.com/news/bad-crash-on-coquihalla-south-of-merritt-on-monday-afternoon-attributed-to-wildlife",
    // "https://calgaryherald.com/news/local-news/nurses-say-immediate-action-needed-in-wake-of-calgary-icu-nurse-apparent-overdose-death",
    // "https://edmontonjournal.com/news/local-news/alberta-health-services-responds-to-more-than-3000-covid-19-health-measure-complaints",
    // "https://ipolitics.ca/2021/09/30/government-must-prioritize-amending-broadcasting-act-blanchet/",
    "https://financialpost.com/opinion/peter-menzies-stop-messing-with-free-speech-on-the-internet",
  ];

  describe("fetchBPPressInfo", () => {
    it("Analyzes the text of a new article", async () => {
      const testUrl =
        "https://www.theguardian.com/world/2021/oct/07/britons-stranded-in-afghanistan-call-for-urgent-evacuation-help";

      const webService = new WebService();

      const { content: articleText } = await webService.fetchArticleData(testUrl);

      const bpPressArticleRating = await webService.fetchBPPressInfo(articleText);

      expect(typeof bpPressArticleRating).toEqual("number");
    });
  });

  describe("getMediaSourceData", () => {
    it("Gets the media source information from a provided URL", async () => {
      const webService = new WebService();
      const testArray = [];
      for await (const url of testUrls) {
        const mediaSourceData = await webService.getMediaSourceData(url);

        console.debug({ [mediaSourceData.title]: mediaSourceData });

        expect(typeof mediaSourceData.title).toEqual("string");
        expect(typeof mediaSourceData.source).toEqual("string");
        expect(typeof mediaSourceData.url).toEqual("string");
        expect(typeof mediaSourceData.description).toEqual("string");
        expect(typeof mediaSourceData.bpPressArticleRating).toEqual("number");
        testArray.push({
          "Article Title": mediaSourceData.title,
          "Article URL": mediaSourceData.url,
          "Bipartisan Press Rating": mediaSourceData.bpPressArticleRating,
        });

        await wait(2000);
      }
      console.debug({ testArray });
    });
  });

  describe("fetchArticleData", () => {
    it("Gets the text of a news article from a URL", async () => {
      const webService = new WebService();
      for await (const url of testUrls) {
        const articleData = await webService.fetchArticleData(url);

        console.debug({ [articleData.title]: articleData });

        expect(typeof articleData.content).toEqual("string");
        expect(typeof articleData.title).toEqual("string");
        expect(typeof articleData.source).toEqual("string");
      }
    });
  });

  describe("fetchMediaBiasFactCheckData", () => {
    it("Fetches the Media Bias Fact Check information for a single article", async () => {
      const webService = new WebService();
      for await (const url of testUrls) {
        const { hostname, source } = await webService.fetchArticleData(url);
        const mbfcData = await webService.fetchMediaBiasFactCheckData(hostname, source);
        const { factualReporting, country, biasRating } = mbfcData;

        console.debug({ [new URL(url).hostname]: mbfcData });

        expect(factualReporting).toBeTruthy();
        expect(typeof factualReporting).toEqual("string");
        expect(country).toBeTruthy();
        expect(typeof country).toEqual("string");
        expect(biasRating).toBeTruthy();
        expect(typeof biasRating).toEqual("string");
      }
    });
  });
});
