// Load .env data into process.env
import dotenv from "dotenv-flow";
dotenv.config({ node_env: "test" });

// Other dependencies
import fs from "fs";
import { db, sql } from "../db";

// Loads the schema files from db/schema
const runSchemaFiles = async function (): Promise<void> {
  console.log(`[LOCAL DATABASE RESET] -> Loading Schema Files ...`);

  const schemaFiles: string[] = fs.readdirSync("./src/db/psql/schema");

  for await (const schemaFile of schemaFiles) {
    const sqlQuery = sql(`../db/psql/schema/${schemaFile}`);

    console.log(`\t[LOCAL DATABASE RESET] -> Running ${schemaFile}`);
    await db.none(sqlQuery);
  }
};

const runSeedFiles = async function (): Promise<void> {
  console.log(`[LOCAL DATABASE RESET] -> Loading Seed files ...`);

  const schemaFiles: string[] = fs.readdirSync("./src/db/psql/seeds");

  for await (const schemaFile of schemaFiles) {
    const sqlQuery = sql(`../db/psql/seeds/${schemaFile}`);

    console.log(`\t[LOCAL DATABASE RESET] -> Running ${schemaFile}`);
    await db.none(sqlQuery);
  }
};

const runTestSeedFiles = async function (): Promise<void> {
  console.log(`[LOCAL DATABASE RESET] -> Loading Test DB Seed files ...`);

  const schemaFiles: string[] = fs.readdirSync("./src/db/psql/test_seeds");

  for await (const schemaFile of schemaFiles) {
    const sqlQuery = sql(`../db/psql/test_seeds/${schemaFile}`);

    console.log(`\t[LOCAL DATABASE RESET] -> Running ${schemaFile}`);
    await db.none(sqlQuery);
  }
};

(async (): Promise<void> => {
  try {
    console.log(
      `[LOCAL DATABASE RESET] -> Connecting to PG using pg-promise ...`,
    );
    await runSchemaFiles();
    await runSeedFiles();
    await runTestSeedFiles();
  } catch (error) {
    console.error(
      `[LOCAL DATABASE RESET ERROR] -> Failed due to error: ${error}`,
    );
  }
})();
