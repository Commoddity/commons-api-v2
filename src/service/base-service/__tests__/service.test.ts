import { BaseService } from "..";
import { testBills } from "@test";

describe(`BaseService methods`, () => {
  // beforeEach(async () => {
  // });

  describe(`createColumns`, () => {
    const testBaseService = new BaseService();
    const ProtoBaseService = Object.getPrototypeOf(testBaseService);

    const correctColumnsOutputForBills =
      "parliamentary_session_id, code, title, description, introduced_date, summary_url, page_url, full_text_url, passed";

    it(`Creates a the columns string for an SQL query from a single object`, async () => {
      const testObject = testBills[0];
      const testColumns = ProtoBaseService.createColumns(testObject);

      expect(testColumns).toEqual(correctColumnsOutputForBills);
    });

    it(`Creates a the columns string for an SQL query from an array of objects`, async () => {
      const testObjectsArray = testBills;
      const testColumns = ProtoBaseService.createColumns(testObjectsArray);

      expect(testColumns).toEqual(correctColumnsOutputForBills);
    });
  });
});

// describe(`createQuery`, () => {
//   it(`Creates a properly formatted SQL query for an array of values`, async () => {
//     const testTable = "test_table";
//     const testColumnsString =
//       "test_1 = ?, test_2 = ?, test_3 = ?, test_created_at = ?";
//     const testValues = ["value_1", "value_2", "value_3", "date_value"];
//     const testBaseService = new BaseService();
//     const protoBaseService = Object.getPrototypeOf(testBaseService);
//     const testQueryOutput = protoBaseService.createQuery(
//       testTable,
//       testColumnsString,
//       testValues,
//     );
//     const correctSQLString = `INSERT INTO test_table (test_1 = 'value_1', test_2 = 'value_2', test_3 = 'value_3', test_created_at = 'date_value') RETURNING *`;
//     expect(testQueryOutput.replace(/\s/g, "")).toEqual(
//       correctSQLString.replace(/\s/g, ""),
//     );
//   });
// });
// it(`Creates a properly formatted SQL query for an array of arrays of objects`, async () => {
//   const testTable = "test_table";
//   const testColumnsString =
//     "test_1 = ?, test_2 = ?, test_3 = ?, test_created_at = ?";
//   const testValuesArray = testBills;
//   const testBaseService = new BaseService();
//   const protoBaseService = Object.getPrototypeOf(testBaseService);
//   const testQueryOutput = protoBaseService.createQuery(
//     testTable,
//     testColumnsString,
//     testValuesArray,
//   );
//   console.log("testQueryOutput", testQueryOutput);
// const correctSQLString = `INSERT INTO test_table (test_1 = 'value_1', test_2 = 'value_2', test_3 = 'value_3', test_created_at = 'date_value') RETURNING *`;
// expect(testQueryOutput.replace(/\s/g, "")).toEqual(
//   correctSQLString.replace(/\s/g, ""),
// );
// });
