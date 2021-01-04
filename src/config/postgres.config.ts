import dotenv from "dotenv-flow";
import pgPromise from "pg-promise";

dotenv.config();

const pgp = pgPromise({});

console.log("HERE IS PROCESS.ENV", process.env.NODE_ENV);

// Development database configuration
const devConfig = {
  host: String(process.env.POSTGRES_HOST),
  port: Number(process.env.POSTGRES_PORT),
  database: String(process.env.POSTGRES_DB),
  user: String(process.env.POSTGRES_USER),
  password: String(process.env.POSTGRES_PASSWORD),
};

const db = pgp(devConfig);

export { db };
