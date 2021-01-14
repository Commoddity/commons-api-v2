// load .env data into process.env
import dotenv from "dotenv-flow";
dotenv.config({ node_env: "dev" });

// other dependencies
import fs from "fs";
import { db, sql } from "../db";

// PG connection setup
const connectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

// Loads the schema files from db/schema
const runSchemaFiles = async function (): Promise<void> {
  console.log(`[dev - LOCAL DATABASE RESET] -> Loading Schema Files ...`);

  const schemaFiles: string[] = fs.readdirSync("./src/db/psql/schema");

  console.log(schemaFiles);
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

    console.log(`\t[LOCAL DATABASE RESET] -> Running ${schemaFile}`);
    await db.none(sqlQuery);
  }
};

(async (): Promise<void> => {
  try {
    console.log(
      `[dev - LOCAL DATABASE RESET] -> Connecting to PG using ${connectionString} ...`,
    );
    await runSchemaFiles();
    await runSeedFiles();
  } catch (error) {
    console.error(
      `[dev - LOCAL DATABASE RESET ERROR] -> Failed due to error: ${error}`,
    );
  }
})();
