import {
  BillsService,
  ParliamentsService,
  WebService,
} from "../../../services";
import { testBills } from "../../../test";
import { Bill } from "../model";
import { EBillCategories } from "../../../types";
import { initClient } from "../../../db";

beforeAll(async () => {
  await initClient();
});

afterEach(async () => {
  await new BillsService().deleteMany(
    {
      code: {
        $in: [...testBills.map(({ code }) => code), "C-231", "C-44", "C-829"],
      },
    },
    { hard: true },
  );
});

afterAll(async () => {
  await new BillsService().closeDbConnection();
});

describe(`BillsService methods`, () => {
  describe(`Create Bill`, () => {
    it(`Creates a new bill in the DB `, async () => {
      const testBillInput = testBills[1];
      const parliamentarySessionId =
        await new ParliamentsService().queryLatestSession();
      testBillInput.parliamentarySessionId = parliamentarySessionId;

      const testBillResult = await new BillsService().createBill(
        new Bill(testBillInput as any),
      );

      // Test bill minus the fields id and createdAt (which will differ between creations)
      const testBill = {
        parliamentarySessionId,
        code: "C-231",
        title: "A Bill for the Provision of Momentary Sanity",
        description: "Why god why",
        summaryUrl: "http://billsarebills.com",
        pageUrl: "http://billsbillsbills.com",
        fullTextUrl: "http://whybillstho.com",
        passed: true,
        categories: [],
        events: [],
      };

      delete testBillResult.id;
      delete testBillResult.introducedDate;
      delete testBillResult.createdAt;
      expect(testBillResult).toEqual(testBill);
    });
  });

  describe(`Create Many Bills`, () => {
    it(`Creates many bills in the DB `, async () => {
      const testBillsInput = testBills;
      const parliamentarySessionId =
        await new ParliamentsService().queryLatestSession();
      testBillsInput.forEach((bill) => {
        bill.parliamentarySessionId = parliamentarySessionId;
      });

      const testBillsResult = await new BillsService().createManyBills(
        testBillsInput.map((bill) => new Bill(bill as any)),
      );

      expect(Array.isArray(testBillsResult)).toBeTruthy();
      expect(testBillsResult).toHaveLength(testBillsInput.length);
    });
  });

  describe(`Delete Bill`, () => {
    it(`Deletes a bill in the DB by its code`, async () => {
      const testBillInput = testBills[2];

      const service = new BillsService();

      // Create bill to test deletion method
      await service.createBill(new Bill(testBillInput as any));

      await service.deleteBill({
        code: testBillInput.code,
      });

      const billExists = await service.doesOneExist({
        code: testBillInput.code,
      });

      expect(billExists).toEqual(false);
    });
  });

  describe(`updateBillPassed`, () => {
    it(`Updates a bill's passed field`, async () => {
      const testBill = {
        parliamentarySessionId: "1234",
        code: "C-44",
        title: "A Bill for the Provision of Momentary Sanity",
        description: "Why god why",
        summaryUrl: "http://billsarebills.com",
        pageUrl: "http://billsbillsbills.com",
        fullTextUrl: "http://whybillstho.com",
        passed: true,
        categories: [],
        events: [],
      };
      await new BillsService().createBill(new Bill(testBill as any));

      const updatedBillToTrue = await new BillsService().updateBillPassed({
        code: testBill.code,
        passed: true,
      });
      expect(updatedBillToTrue.code).toEqual(testBill.code);
      expect(updatedBillToTrue.passed).toEqual(true);

      const updatedBillToFalse = await new BillsService().updateBillPassed({
        code: testBill.code,
        passed: false,
      });
      expect(updatedBillToFalse.passed).toEqual(false);
    });
  });

  describe(`updateSummaryUrls`, () => {
    it(`Updates a bill's summaryUrl field`, async () => {
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
    it(`Should update a bill's categories `, async () => {
      const testBill = {
        parliamentarySessionId: "1234",
        code: "C-829",
        title: "A Bill for the Provision of Momentary Sanity",
        description: "Why god why",
        summaryUrl: "http://billsarebills.com",
        pageUrl: "http://billsbillsbills.com",
        fullTextUrl: "http://whybillstho.com",
        passed: true,
        categories: [],
        events: [],
      };
      await new BillsService().createBill(new Bill(testBill as any));

      const afterUpdate = await new BillsService().addBillCategory({
        code: testBill.code,
        category: EBillCategories.arts_culture,
      });

      expect(afterUpdate.categories).toContain(EBillCategories.arts_culture);
    });
  });

  describe.skip(`addBillsToParliamentarySession`, () => {
    it(`Should add newly created bills to the parliamentary session's bills array `, async () => {
      /* Test Setup */
      const testBillsService = new BillsService();
      const ProtoBillsService = Object.getPrototypeOf(testBillsService);
      const parliamentarySessionId =
        await new ParliamentsService().queryLatestSession();

      /* Test Execution */
      await ProtoBillsService.addBillsToParliamentarySession(
        ["C-829"],
        parliamentarySessionId,
      );

      /* Test Assertions */
      const { parliamentarySessions } = await new ParliamentsService().findOne({
        "parliamentarySessions.id": parliamentarySessionId,
      });
      const { bills } = parliamentarySessions[parliamentarySessions.length - 1];

      expect(bills).toContain("C-829");
    });
  });
});
