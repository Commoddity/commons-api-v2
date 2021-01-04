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

  describe(`createSingleUpdateQuery`, () => {
    it(`Creates the update query for an SQL query for updating a single object with a single value`, () => {
      const testTable = "bills";
      const testColumn = "summary_url";
      const testValue = "https://www.testingupdatequery.com";
      const testWhereClause = { column: "code", value: "C-420" };

      const testSelectQuery = ProtoBaseService.createSingleUpdateQuery({
        table: testTable,
        column: testColumn,
        value: testValue,
        whereClause: testWhereClause,
      });

      const correctSelectQuery = `UPDATE "bills" SET "summary_url"='https://www.testingupdatequery.com' WHERE code='C-420'`;

      expect(testSelectQuery).toEqual(correctSelectQuery);
    });
  });

  describe(`createWhereClause`, () => {
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

    it(`Creates the where clause for an SQL query from an array of objects with an OR operator`, () => {
      const testObjectsArray = [
        { column: "created_at", value: "1987/03/22" },
        { column: "code", value: "C-432" },
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
