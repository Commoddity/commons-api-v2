import { BillsService, ParliamentsService, WebService } from "@services";
import { resetBills, testBills } from "@test";
import { BillInterface } from "../model";

describe(`BillsService methods`, () => {
  afterEach(async () => {
    await resetBills();
  });

  describe(`Create Bill`, () => {
    it(`Creates a new bill in the DB `, async () => {
      const testBillInput = testBills[1];
      const parliamentary_session_id = await new ParliamentsService().queryLatestParliamentarySession();
      testBillInput.parliamentary_session_id = parliamentary_session_id;

      const testBillResult = await new BillsService().createBill(testBillInput);

      // Test bill minus the fields id and created_at (which will differ between creations)
      const testBill = {
        parliamentary_session_id,
        code: "C-231",
        title: "A Bill for the Provision of Momentary Sanity",
        description: "Why god why",
        summary_url: "http://billsarebills.com",
        page_url: "http://billsbillsbills.com",
        full_text_url: "http://whybillstho.com",
        passed: true,
      };

      delete testBillResult.id;
      delete testBillResult.introduced_date;
      delete testBillResult.created_at;
      expect(testBillResult).toEqual(testBill);
    });
  });

  describe(`Create Many Bills`, () => {
    it(`Creates many bills in the DB `, async () => {
      const testBillsInput: BillInterface[] = testBills;
      const parliamentary_session_id = await new ParliamentsService().queryLatestParliamentarySession();
      testBillsInput.forEach((bill) => {
        bill.parliamentary_session_id = parliamentary_session_id;
      });

      const testBillsResult = await new BillsService().createManyBills(
        testBillsInput,
      );

      expect(Array.isArray(testBillsResult)).toBeTruthy();
      expect(testBillsResult).toHaveLength(testBillsInput.length);
    });
  });

  describe(`Delete Bill`, () => {
    it(`Deletes a bill in the DB by its code`, async () => {
      const testBillInput = testBills[2];

      // Create bill to test deletion method
      await new BillsService().createBill(testBillInput);

      const deleteBillResult = await new BillsService().deleteBill(
        testBillInput.code,
      );

      expect(deleteBillResult).toEqual(true);
    });
  });

  describe(`updateBillPassed`, () => {
    it(`Updates a bill's passed field`, async () => {
      const testBillCode = "C-44";

      const updatedBillToTrue = await new BillsService().updateBillPassed({
        code: testBillCode,
        passed: true,
      });
      expect(updatedBillToTrue.code).toEqual(testBillCode);
      expect(updatedBillToTrue.passed).toEqual(true);

      const updatedBillToFalse = await new BillsService().updateBillPassed({
        code: testBillCode,
        passed: false,
      });
      expect(updatedBillToFalse.passed).toEqual(false);
    });
  });

  describe(`updateSummaryUrl`, () => {
    it(`Updates a bill's summary_url field`, async () => {
      const testBillCode = "C-829";
      const testUpdatedSummaryUrl = "http://www.kony2012.com";

      const updateSummaryUrl = await new BillsService().updateSummaryUrl({
        code: testBillCode,
        summary_url: testUpdatedSummaryUrl,
      });
      expect(updateSummaryUrl.code).toEqual(testBillCode);
      expect(updateSummaryUrl.summary_url).toEqual(testUpdatedSummaryUrl);

      const testOriginalSummaryUrl = "http://www.climbthetrees.com";
      const originalSummaryUrl = await new BillsService().updateSummaryUrl({
        code: testBillCode,
        summary_url: testOriginalSummaryUrl,
      });
      expect(originalSummaryUrl.summary_url).toEqual(testOriginalSummaryUrl);
    });
  });

  describe(`updateSummaryUrl`, () => {
    it(`Updates a bill's summary_url field`, async () => {
      const testWebService = new WebService();
      const ProtoWebService = Object.getPrototypeOf(testWebService);
      const billSummaryMaps = await ProtoWebService.getSummaries();

      const billsUpdated = await new BillsService().updateSummaryUrls(
        billSummaryMaps,
      );

      // No bills from the actual Summaries site are in the Test DB
      expect(billsUpdated).toEqual(0);
    });
  });

  describe(`updateBillCategories`, () => {
    it(`Creates join tables for a given bill to create a many to many relationship with a number of categories`, async () => {
      const testBillCode = "C-829";
      const testCategories = [
        "agriculture_environment",
        "economics_finance",
        "employment_labour",
      ];

      const joinTablesCreated = await new BillsService().updateBillCategories({
        code: testBillCode,
        categories: testCategories,
      });

      expect(joinTablesCreated).toEqual(true);
    });

    it(`Should fail if passed invalid category`, async () => {
      const testBillCode = "C-829";
      const testCategories = ["agriculture_environment", "goofin_around"];

      try {
        await new BillsService().updateBillCategories({
          code: testBillCode,
          categories: testCategories,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
