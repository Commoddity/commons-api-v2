import { BaseService } from "..";
import { testBills } from "@test";

describe(`BaseService methods`, () => {
  describe(`createColumns`, () => {
    const testBaseService = new BaseService();
    const ProtoBaseService = Object.getPrototypeOf(testBaseService);

    const correctColumnsOutputForBills =
      "parliamentary_session_id, code, title, description, introduced_date, summary_url, page_url, full_text_url, passed";

    it(`Creates the columns string for an SQL query from a single object`, () => {
      const testObject = testBills[0];
      const testColumns = ProtoBaseService.createColumns(testObject);

      expect(testColumns).toEqual(correctColumnsOutputForBills);
    });

    it(`Creates the columns string for an SQL query from an array of objects`, () => {
      const testObjectsArray = testBills;
      const testColumns = ProtoBaseService.createColumns(testObjectsArray);

      expect(testColumns).toEqual(correctColumnsOutputForBills);
    });
  });
});

describe(`createWhereClause`, () => {
  const testBaseService = new BaseService();
  const ProtoBaseService = Object.getPrototypeOf(testBaseService);

  it(`Creates the where clause for an SQL query from a single object`, () => {
    const testObject = { column: "created_at", value: "2020/10/24" };
    const correctWhereClauseOutputForSingleObject =
      " WHERE created_at='2020/10/24'";

    const testWhereClauseForSingleObject = ProtoBaseService.createWhereClause(
      testObject,
    );

    expect(testWhereClauseForSingleObject).toEqual(
      correctWhereClauseOutputForSingleObject,
    );
  });

  it(`Creates the where clause for an SQL query from an array of objects`, () => {
    const testObjectsArray = [
      { column: "created_at", value: "1987/03/22" },
      { column: "code", value: "C-432" },
    ];
    const testWhereClauseForArray = ProtoBaseService.createWhereClause(
      testObjectsArray,
    );
    const correctWhereClauseOutputForArray =
      " WHERE created_at='1987/03/22' AND code='C-432'";

    expect(testWhereClauseForArray).toEqual(correctWhereClauseOutputForArray);
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
