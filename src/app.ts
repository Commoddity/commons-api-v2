import express from "express";
import { graphqlHTTP } from "express-graphql";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import path from "path";
const dotenvPath = path.join(__dirname, "../", `.env.${process.env.NODE_ENV}`);
dotenv.config({
  path: dotenvPath,
});

import cors from "cors";
import { schema as graphQLSchema } from "@db";

const corsOptions = {
  origin: process.env.COMMONS_FRONT_END,
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
  "/api",
  graphqlHTTP({
    schema: graphQLSchema,
    graphiql: true,
  }),
);

export { app };
