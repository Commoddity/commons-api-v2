import dotenv from "dotenv-flow";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";

import { schema as GraphQLSchema } from "@db";
import { serverConfig } from "./server.config";

dotenv.config({ node_env: process.env.NODE_ENV });

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
    schema: GraphQLSchema,
    graphiql: true,
  }),
);

app.listen(serverConfig.SERVER_PORT, () =>
  console.log(
    `Commons App Express GraphQL API now running ...\nServer running in [${NODE_ENV.toUpperCase()}] mode and listening on port ${
      serverConfig.SERVER_PORT
    } ...\nConnected to database: ${process.env.POSTGRES_DB} ...`,
  ),
);
