import { BillsService } from "..";
import { testBills } from "@test";

describe(`BillsService methods`, () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
  });

  describe(`Create Bill`, () => {
    it(`Creates a new bill in the DB `, async () => {
      const testBillInput = testBills[1];
      const testBillResult = await new BillsService().createBill(testBillInput);

      // Test bill minus the fields id and created_at (which will differ between creations)
      const testBill = {
        parliamentary_session_id: 2,
        code: "C-231",
        title: "A Bill for the Provision of Momentary Sanity",
        description: "Why god why",
        introduced_date: new Date("2020-08-26T07:00:00.000Z"),
        summary_url: "http://billsarebills.com",
        page_url: null,
        full_text_url: "http://whybillstho.com",
        passed: true,
      };

      expect(testBillResult).toEqual(expect.objectContaining(testBill));

      afterEach(async () => {
        // Clean up bill created by test
        await new BillsService().deleteBill(testBillResult.code);
      });
    });
  });

  describe(`deleteBill`, () => {
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
});
