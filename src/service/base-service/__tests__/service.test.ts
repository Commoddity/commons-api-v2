import { BaseService } from "..";

describe(`Base Service Methods`, () => {
  describe(`findAllValues`, () => {
    it(`Returns all ids in the bills table, sorted`, async () => {
      const testTable = "bills";
      const testColumn = "id";

      const testReturnedIds = await new BaseService().findAllValues({
        table: testTable,
        column: testColumn,
        sort: true,
      });

      const testDbBillIds = [1, 2, 3];

      expect(testReturnedIds).toEqual(testDbBillIds);
    });

    it(`Returns all codes in the bills table, unsorted`, async () => {
      const testTable = "bills";
      const testColumn = "code";

      const testReturnedCodes = await new BaseService().findAllValues({
        table: testTable,
        column: testColumn,
      });

      const testDbBillCodes = ["C-44", "C-420", "C-829"];

      expect(testReturnedCodes).toEqual(
        expect.arrayContaining(testDbBillCodes),
      );
    });

    it(`Returns all bill_codes in the events table, unsorted`, async () => {
      const testTable = "events";
      const testColumn = "bill_code";

      const testReturnedBillCodes = await new BaseService().findAllValues({
        table: testTable,
        column: testColumn,
      });

      const testDbBillCodes = ["C-420", "C-829", "C-44"];

      expect(testReturnedBillCodes).toEqual(testDbBillCodes);
    });
  });
});
