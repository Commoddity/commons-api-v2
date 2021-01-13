import dotenv from "dotenv-flow";
import pgPromise, { QueryFile } from "pg-promise";
import { join } from "path";

dotenv.config({ node_env: process.env.NODE_ENV });

const pgp = pgPromise({
  capSQL: true,
});

// Development database configuration
const devConfig = {
  host: String(process.env.POSTGRES_HOST),
  port: Number(process.env.POSTGRES_PORT),
  database: String(process.env.POSTGRES_DB),
  user: String(process.env.POSTGRES_USER),
  password: String(process.env.POSTGRES_PASSWORD),
};

const db = pgp(devConfig);

// Helper for linking to external query files:
const sql = (file): QueryFile => {
  const fullPath = join(__dirname, file);
  return new pgp.QueryFile(fullPath, { minify: true });
};

export { db, pgp, sql };
