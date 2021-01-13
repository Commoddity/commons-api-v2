import dotenv from "dotenv-flow";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import { serverConfig } from "./server.config";
import { schema as GraphQLSchema } from "@db";

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
    graphiql: NODE_ENV === "dev" ? true : false,
  }),
);

app.listen(serverConfig.SERVER_PORT, () =>
  console.log(
    `Commons App Express GraphQL API now running ...\n
    Server running in environment [${NODE_ENV.toUpperCase()}] ...\n 
    Connected to database: ${process.env.POSTGRES_DB} ...\n
    Listening on port ${serverConfig.SERVER_PORT} ...`,
  ),
);
