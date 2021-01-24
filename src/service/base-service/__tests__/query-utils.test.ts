import { QueryUtils } from "@services";
import { testBills } from "@test";

describe(`Base Service Methods`, () => {
  describe(`BaseService query string private methods`, () => {
    describe(`createDeleteQuery`, () => {
      const testTable = "bills";

      it(`Creates the query string for an SQL delete query from a single where condition`, () => {
        const testDeleteQuery = QueryUtils.createDeleteQuery(testTable, {
          code: "C-420",
        });
        const correctDeleteQueryForBills = `DELETE FROM bills WHERE code='C-420'`;

        expect(testDeleteQuery).toEqual(correctDeleteQueryForBills);
      });

      it(`Creates the query string for an SQL delete query from multiple where conditions`, () => {
        const testDeleteQuery = QueryUtils.createDeleteQuery(testTable, [
          { code: "C-420" },
          { created_at: "2020/09/23" },
        ]);
        const correctDeleteQueryForBills = `DELETE FROM bills WHERE code='C-420' AND created_at='2020/09/23'`;

        expect(testDeleteQuery).toEqual(correctDeleteQueryForBills);
      });

      it(`Creates the query string for an SQL delete query from multiple where conditions and when passed an operator`, () => {
        const testDeleteQuery = QueryUtils.createDeleteQuery(
          testTable,
          [{ code: "C-420" }, { created_at: "2020/09/23" }],
          "OR",
        );
        const correctDeleteQueryForBills = `DELETE FROM bills WHERE code='C-420' OR created_at='2020/09/23'`;

        expect(testDeleteQuery).toEqual(correctDeleteQueryForBills);
      });
    });

    describe(`createInsertQuery`, () => {
      const testTable = "bills";

      it(`Creates the query string for an SQL insert query from a single object`, () => {
        const testObject = testBills[0];
        const testQuery = QueryUtils.createInsertQuery(testObject, testTable);
        const correctQueryForBills = `INSERT INTO "bills"("parliamentary_session_id","code","title","description","introduced_date","summary_url","page_url","full_text_url","passed") VALUES('SJs9RCpn8Rvl0qmRtQ1e','C-205','A Bill to Touch Butts','Literally just touching butts.','2020/09/23','http://billsbillsbills.com','http://billsandbills.com','http://billsplusbills.com',null) RETURNING *`;

        expect(testQuery).toEqual(correctQueryForBills);
      });

      it(`Creates the query string for an SQL insertquery from an array of objects`, () => {
        const testObjectsArray = testBills;
        const testQueryForArrays = QueryUtils.createInsertQuery(
          testObjectsArray,
          testTable,
        );
        const correctQueryForBillsArray = `INSERT INTO "bills"("parliamentary_session_id","code","title","description","introduced_date","summary_url","page_url","full_text_url","passed") VALUES('SJs9RCpn8Rvl0qmRtQ1e','C-205','A Bill to Touch Butts','Literally just touching butts.','2020/09/23','http://billsbillsbills.com','http://billsandbills.com','http://billsplusbills.com',null),('QRq6LhKG2EBoFOvNo1qv','C-231','A Bill for the Provision of Momentary Sanity','Why god why','2020/08/26','http://billsarebills.com','http://billsbillsbills.com','http://whybillstho.com',true),('QRq6LhKG2EBoFOvNo1qv','C-242','A Bill for Sea Otters','Cute little guys','2019/03/10','http://billsarebills.com','http://billsbillsbills.com','http://whybillstho.com',true) RETURNING *`;

        expect(testQueryForArrays).toEqual(correctQueryForBillsArray);
      });
    });

    describe(`createSelectQuery`, () => {
      it(`Creates the select query for an SQL query for finding multiple objects`, () => {
        const testTable = "bills";
        const testWhereClause = "WHERE created_at='1987/03/22' OR code='C-432'";
        const testSelectQuery = QueryUtils.createSelectQuery(
          testTable,
          testWhereClause,
          true,
        );

        const correctSelectQuery =
          "SELECT * FROM bills WHERE created_at='1987/03/22' OR code='C-432'";

        expect(testSelectQuery).toEqual(correctSelectQuery);
      });

      it(`Creates the select query for an SQL query for finding a single object`, () => {
        const testTable = "parliaments";
        const testWhereClause = "WHERE created_at='2018/03/22' OR session='1'";
        const testSelectQueryForSingleObject = QueryUtils.createSelectQuery(
          testTable,
          testWhereClause,
          false,
        );

        const correctSelectQueryForSingleObject =
          "SELECT * FROM parliaments WHERE created_at='2018/03/22' OR session='1' LIMIT 1";

        expect(testSelectQueryForSingleObject).toEqual(
          correctSelectQueryForSingleObject,
        );
      });
    });

    describe(`createUpdateQuery`, () => {
      it(`Creates the update query for an SQL query for updating a single object with a single value`, () => {
        const testTable = "bills";
        const testData = {
          code: "C-420",
          summary_url: "https://www.testingupdatequery.com",
        };

        const testUpdateQuery = QueryUtils.createUpdateQuery({
          table: testTable,
          data: testData,
        });

        const correctSelectQuery = `UPDATE "bills" SET "summary_url"='https://www.testingupdatequery.com' WHERE code='C-420' RETURNING *`;

        expect(testUpdateQuery).toEqual(correctSelectQuery);
      });

      it(`Creates the update query for an SQL query for updating a single object with multiple values`, () => {
        const testTable = "bills";
        const testData = {
          code: "C-420",
          summary_url: "https://www.testingupdatequery.com",
          passed: true,
        };

        const testUpdateQuery = QueryUtils.createUpdateQuery({
          table: testTable,
          data: testData,
        });

        const correctSelectQuery = `UPDATE "bills" SET "summary_url"='https://www.testingupdatequery.com',"passed"=true WHERE code='C-420' RETURNING *`;

        expect(testUpdateQuery).toEqual(correctSelectQuery);
      });

      it(`Creates the update query for an SQL query for updating multiple objects with a single value`, () => {
        const testTable = "bills";
        const testDataArray = [
          {
            code: "C-420",
            summary_url: "https://www.testingupdatequery.com",
          },
          {
            code: "C-666",
            summary_url: "https://www.testingupdatequeryItem2.com",
          },
        ];

        const testUpdateQuery = QueryUtils.createUpdateQuery({
          table: testTable,
          data: testDataArray,
        });

        const correctSelectQuery = `UPDATE "bills" AS t SET "summary_url"=v."summary_url" FROM (VALUES('C-420','https://www.testingupdatequery.com'),('C-666','https://www.testingupdatequeryItem2.com')) AS v("code","summary_url") WHERE v.code = t.code RETURNING *`;

        expect(testUpdateQuery).toEqual(correctSelectQuery);
      });

      it(`Creates the update query for an SQL query for updating multiple objects with multiples values`, () => {
        const testTable = "bills";
        const testDataArray = [
          {
            code: "C-420",
            summary_url: "https://www.testingupdatequery.com",
            passed: true,
          },
          {
            code: "C-666",
            summary_url: "https://www.testingupdatequeryItem2.com",
            passed: false,
          },
        ];

        const testUpdateQuery = QueryUtils.createUpdateQuery({
          table: testTable,
          data: testDataArray,
        });

        const correctSelectQuery = `UPDATE "bills" AS t SET "summary_url"=v."summary_url","passed"=v."passed" FROM (VALUES('C-420','https://www.testingupdatequery.com',true),('C-666','https://www.testingupdatequeryItem2.com',false)) AS v("code","summary_url","passed") WHERE v.code = t.code RETURNING *`;

        expect(testUpdateQuery).toEqual(correctSelectQuery);
      });
    });

    describe(`createWhereClause`, () => {
      it(`Creates the where clause for an SQL query from a single object`, () => {
        const testObject = { created_at: "2020/10/24" };
        const correctWhereClauseOutputForSingleObject =
          " WHERE created_at='2020/10/24'";

        const testWhereClauseForSingleObject = QueryUtils.createWhereClause(
          testObject,
        );

        expect(testWhereClauseForSingleObject).toEqual(
          correctWhereClauseOutputForSingleObject,
        );
      });

      it(`Creates the where clause for an SQL query from an array of objects`, () => {
        const testObjectsArray = [
          { created_at: "1987/03/22" },
          { code: "C-432" },
        ];
        const testWhereClauseForArray = QueryUtils.createWhereClause(
          testObjectsArray,
        );
        const correctWhereClauseOutputForArray =
          " WHERE created_at='1987/03/22' AND code='C-432'";

        expect(testWhereClauseForArray).toEqual(
          correctWhereClauseOutputForArray,
        );
      });

      it(`Creates the where clause for an SQL query from an array of objects with an OR operator`, () => {
        const testObjectsArray = [
          { created_at: "1987/03/22" },
          { code: "C-432" },
        ];
        const testWhereClauseForArray = QueryUtils.createWhereClause(
          testObjectsArray,
          "OR",
        );
        const correctWhereClauseOutputForArray =
          " WHERE created_at='1987/03/22' OR code='C-432'";

        expect(testWhereClauseForArray).toEqual(
          correctWhereClauseOutputForArray,
        );
      });
    });
  });
});
