export const config = {
  host: String(process.env.POSTGRES_HOST),
  port: Number(process.env.POSTGRES_PORT),
  database: String(process.env.POSTGRES_DB),
  user: String(process.env.POSTGRES_USER),
  password: String(process.env.POSTGRES_PASSWORD),
};
