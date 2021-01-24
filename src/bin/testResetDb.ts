// Other dependencies
import fs from "fs";
import { db, sql } from "../db";

// Loads the schema files from db/schema
const runSchemaFile = async function (): Promise<void> {
  console.log(`[dev - LOCAL DATABASE RESET] -> Loading Schema File ...`);

  const sqlQuery = sql(`./schema/schema_reset.sql`);

  console.log(`\t[dev - LOCAL DATABASE RESET] -> Running schema file`);
  await db.none(sqlQuery);
};

const runTestSeedFiles = async function (): Promise<void> {
  console.log(
    `[test - LOCAL DATABASE RESET] -> Loading Test DB Seed files ...`,
  );

  const schemaFiles: string[] = fs.readdirSync("./src/db/psql/test_seeds");

  for await (const schemaFile of schemaFiles) {
    const sqlQuery = sql(`./test_seeds/${schemaFile}`);

    console.log(`\t[test - LOCAL DATABASE RESET] -> Running ${schemaFile}`);
    await db.none(sqlQuery);
  }
};

(async (): Promise<void> => {
  try {
    console.log(
      `[dev - LOCAL DATABASE RESET] -> Connecting to PG using pg-promise ...`,
    );
    await runSchemaFile();
    await runTestSeedFiles();
  } catch (error) {
    console.error(
      `[dev - LOCAL DATABASE RESET ERROR] -> Failed due to error: ${error}`,
    );
  }
})();
