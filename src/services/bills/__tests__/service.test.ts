import { BillsService } from "../../../services";
import { initClient } from "../../../db";

beforeAll(async () => {
  await initClient();
});

afterAll(async () => {
  await new BillsService().closeDbConnection();
});

describe(`BillsService methods`, () => {
  // describe(`createManyBills`, () => {
  //   it(`Creates many bills in the DB `, async () => {
  //     await new BillsService().createManyBills(44, 1);
  //     await new BillsService().createManyBills(43, 2);
  //     await new BillsService().createManyBills(43, 1);

  //     // expect(Array.isArray(testBillsResult)).toBeTruthy();
  //     // expect(testBillsResult).toHaveLength(testBillsInput.length);
  //   });
  // });

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

  describe(`updateBillsForCurrentSession`, () => {
    it(`Updates Bills if theire status has changed`, async () => {
      const bill = await new BillsService().updateBillsForCurrentSession();
      expect(bill).toBeTruthy();
    });
  });

  // describe(`updateBillCategories`, () => {
  //   it(`Should update a bill's categories `, async () => {
  //     const testBill = {
  //       parliamentarySessionId: "1234",
  //       code: "C-829",
  //       title: "A Bill for the Provision of Momentary Sanity",
  //       description: "Why god why",
  //       summaryUrl: "http://billsarebills.com",
  //       pageUrl: "http://billsbillsbills.com",
  //       fullTextUrl: "http://whybillstho.com",
  //       passed: true,
  //       categories: [],
  //       events: [],
  //     };
  //     await new BillsService().createBill(new Bill(testBill as any));

  //     const afterUpdate = await new BillsService().updateBillCategories(testBill.code, [
  //       EBillCategories.arts_culture,
  //     ]);

  //     expect(afterUpdate.categories).toContain(EBillCategories.arts_culture);
  //   });
  // });

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
