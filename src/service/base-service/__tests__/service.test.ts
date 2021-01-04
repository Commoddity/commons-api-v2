import { BaseService } from "..";
import { testBills } from "@test";

describe(`BaseService query string private methods`, () => {
  const testBaseService = new BaseService();
  const ProtoBaseService = Object.getPrototypeOf(testBaseService);

  describe(`createQuery`, () => {
    const testTable = "bills";

    it(`Creates the query string for an SQL query from a single object`, () => {
      const testObject = testBills[0];
      const testQuery = ProtoBaseService.createInsertQuery(
        testObject,
        testTable,
      );
      const correctQueryForBills = `INSERT INTO "bills"("parliamentary_session_id","code","title","description","introduced_date","summary_url","page_url","full_text_url","passed") VALUES(1,'C-205','A Bill to Touch Butts','Literally just touching butts.','2020/09/23','http://billsbillsbills.com','http://billsandbills.com','http://billsplusbills.com',null)`;

      expect(testQuery).toEqual(correctQueryForBills);
    });

    it(`Creates the query string for an SQL query from an array of objects`, () => {
      const testObjectsArray = testBills;
      const testQueryForArrays = ProtoBaseService.createInsertQuery(
        testObjectsArray,
        testTable,
      );
      const correctQueryForBillsArray = `INSERT INTO "bills"("parliamentary_session_id","code","title","description","introduced_date","summary_url","page_url","full_text_url","passed") VALUES(1,'C-205','A Bill to Touch Butts','Literally just touching butts.','2020/09/23','http://billsbillsbills.com','http://billsandbills.com','http://billsplusbills.com',null),(2,'C-231','A Bill for the Provision of Momentary Sanity','Why god why','2020/08/26','http://billsarebills.com',null,'http://whybillstho.com',true),(2,'C-242','A Bill for Sea Otters','Cute little guys','2019/03/10','http://billsarebills.com',null,'http://whybillstho.com',true)`;

      expect(testQueryForArrays).toEqual(correctQueryForBillsArray);
    });
  });

  describe(`createSelectQuery`, () => {
    it(`Creates the select query for an SQL query for finding multiple objects`, () => {
      const testTable = "bills";
      const testWhereClause = "WHERE created_at='1987/03/22' OR code='C-432'";
      const testSelectQuery = ProtoBaseService.createSelectQuery(
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
      const testSelectQueryForSingleObject = ProtoBaseService.createSelectQuery(
        testTable,
        testWhereClause,
        false,
      );

      const correctSelectQueryForSingleObject =
        "SELECT * FROM parliaments LIMIT 1 WHERE created_at='2018/03/22' OR session='1'";

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

      const testUpdateQuery = ProtoBaseService.createUpdateQuery({
        table: testTable,
        data: testData,
      });

      const correctSelectQuery = `UPDATE "bills" SET "summary_url"='https://www.testingupdatequery.com' WHERE code='C-420'`;

      expect(testUpdateQuery).toEqual(correctSelectQuery);
    });

    it(`Creates the update query for an SQL query for updating a single object with multiple values`, () => {
      const testTable = "bills";
      const testData = {
        code: "C-420",
        summary_url: "https://www.testingupdatequery.com",
        passed: true,
      };

      const testUpdateQuery = ProtoBaseService.createUpdateQuery({
        table: testTable,
        data: testData,
      });

      const correctSelectQuery = `UPDATE "bills" SET "summary_url"='https://www.testingupdatequery.com',"passed"=true WHERE code='C-420'`;

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

      const testUpdateQuery = ProtoBaseService.createUpdateQuery({
        table: testTable,
        data: testDataArray,
      });

      const correctSelectQuery = `UPDATE "bills" AS t SET "summary_url"=v."summary_url" FROM (VALUES('C-420','https://www.testingupdatequery.com'),('C-666','https://www.testingupdatequeryItem2.com')) AS v("code","summary_url") WHERE v.code = t.code`;

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

      const testUpdateQuery = ProtoBaseService.createUpdateQuery({
        table: testTable,
        data: testDataArray,
      });

      const correctSelectQuery = `UPDATE "bills" AS t SET "summary_url"=v."summary_url","passed"=v."passed" FROM (VALUES('C-420','https://www.testingupdatequery.com',true),('C-666','https://www.testingupdatequeryItem2.com',false)) AS v("code","summary_url","passed") WHERE v.code = t.code`;

      expect(testUpdateQuery).toEqual(correctSelectQuery);
    });
  });

  describe(`createWhereClause`, () => {
    it(`Creates the where clause for an SQL query from a single object`, () => {
      const testObject = { created_at: "2020/10/24" };
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
        { created_at: "1987/03/22" },
        { code: "C-432" },
      ];
      const testWhereClauseForArray = ProtoBaseService.createWhereClause(
        testObjectsArray,
      );
      const correctWhereClauseOutputForArray =
        " WHERE created_at='1987/03/22' AND code='C-432'";

      expect(testWhereClauseForArray).toEqual(correctWhereClauseOutputForArray);
    });

    it(`Creates the where clause for an SQL query from an array of objects with an OR operator`, () => {
      const testObjectsArray = [
        { created_at: "1987/03/22" },
        { code: "C-432" },
      ];
      const testWhereClauseForArray = ProtoBaseService.createWhereClause(
        testObjectsArray,
        "OR",
      );
      const correctWhereClauseOutputForArray =
        " WHERE created_at='1987/03/22' OR code='C-432'";

      expect(testWhereClauseForArray).toEqual(correctWhereClauseOutputForArray);
    });
  });
});
