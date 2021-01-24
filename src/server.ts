import express from "express";
import { graphqlHTTP } from "express-graphql";
import serverless from "serverless-http";

import dotenv from "dotenv";
import path from "path";
const dotenvPath = path.join(__dirname, "../", `.env.${process.env.NODE_ENV}`);
dotenv.config({
  path: dotenvPath,
});

import cors from "cors";
import { schema as graphQLSchema } from "@db";

const NODE_ENV = process.env.NODE_ENV || "dev";

const corsOptions = {
  origin: process.env.COMMONS_FRONT_END,
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(
  "/api",
  graphqlHTTP({
    schema: graphQLSchema,
    graphiql: NODE_ENV === "dev" ? true : false,
  }),
);

// app.listen(serverConfig.SERVER_PORT, () =>
//   console.log(
//     `Commons App Express GraphQL API now running ...\n
//     Server running in environment [${NODE_ENV.toUpperCase()}] ...\n
//     Connected to database: ${process.env.POSTGRES_DB} ...\n
//     Listening on port ${serverConfig.SERVER_PORT} ...`,
//   ),
// );

exports.handler = serverless(app);
