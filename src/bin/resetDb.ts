import dotenv from "dotenv";
import path from "path";
const dotenvPath = path.join(__dirname, "../", `.env.${process.env.NODE_ENV}`);
dotenv.config({
  path: dotenvPath,
});

// Other dependencies
import fs from "fs";
import { db, sql } from "../db";

// Loads the schema files from db/schema
const runSchemaFiles = async function (): Promise<void> {
  console.log(`[dev - LOCAL DATABASE RESET] -> Loading Schema Files ...`);

  const schemaFiles: string[] = fs.readdirSync("./src/db/psql/schema");

  for await (const schemaFile of schemaFiles) {
    const sqlQuery = sql(`./schema/${schemaFile}`);

    console.log(`\t[dev - LOCAL DATABASE RESET] -> Running ${schemaFile}`);
    await db.none(sqlQuery);
  }
};

const runSeedFiles = async function (): Promise<void> {
  console.log(`[dev - LOCAL DATABASE RESET] -> Loading Seed files ...`);

  const schemaFiles: string[] = fs.readdirSync("./src/db/psql/seeds");

  for await (const schemaFile of schemaFiles) {
    const sqlQuery = sql(`./seeds/${schemaFile}`);

    console.log(`\t[dev - LOCAL DATABASE RESET] -> Running ${schemaFile}`);
    await db.none(sqlQuery);
  }
};

(async (): Promise<void> => {
  try {
    console.log(
      `[dev - LOCAL DATABASE RESET] -> Connecting to PG using pg-promise ...`,
    );
    await runSchemaFiles();
    await runSeedFiles();
  } catch (error) {
    console.error(
      `[dev - LOCAL DATABASE RESET ERROR] -> Failed due to error: ${error}`,
    );
  }
})();
