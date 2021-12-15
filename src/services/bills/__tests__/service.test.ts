import { BillsService } from "../../../services";
import { initClient } from "../../../db";

beforeAll(async () => {
  await initClient();
});

afterAll(async () => {
  await new BillsService().closeDbConnection();
});

describe(`BillsService methods`, () => {
  describe(`getOneBill`, () => {
    it(`Fetches One Bill`, async () => {
      const bill = await new BillsService().getOneBill({
        parliament: 44,
        session: 1,
        code: "S-216",
      });
      expect(bill).toBeTruthy();
    });
  });

  describe(`getAllBillsForSession`, () => {
    it(`Gets all Bills as well as the billAddedFields`, async () => {
      const bills = await new BillsService().getAllBillsForSession(44, 1);

      expect(bills?.length).toBeTruthy();
    });
  });

  describe(`updateBillsForSession`, () => {
    it(`Creates or updates Bills got a given session`, async () => {
      await new BillsService().updateBillsForSession(44, 1);
      await new BillsService().updateBillsForSession(43, 2);
      await new BillsService().updateBillsForSession(43, 1);
    });
  });

  describe(`addMediaSourceToBill`, () => {
    it(`Collects the media information and adds a media source object to a bill when provided a bill code and medai source URL`, async () => {
      /* Test Execution */
      const testUrls = [
        "https://www.theglobeandmail.com/politics/article-what-is-bill-c-10-and-why-are-the-liberals-planning-to-regulate-the/",
        "https://ipolitics.ca/2021/09/30/government-must-prioritize-amending-broadcasting-act-blanchet/",
        "https://financialpost.com/opinion/peter-menzies-stop-messing-with-free-speech-on-the-internet",
      ];

      let billWithMediaSource;
      const billsService = new BillsService();
      for await (const url of testUrls) {
        billWithMediaSource = await billsService.addMediaSourceToBill(
          {
            parliament: 44,
            session: 1,
            code: "C-10",
          },
          url,
        );
      }

      /* Test Assertions */
      expect(billWithMediaSource.mediaSources.length).toEqual(3);
    });
  });
});
