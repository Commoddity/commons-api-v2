// Load in .env variables
import dotenv from "dotenv";

import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";

import { serverConfig } from "@config";
import { schema as graphQLSchema } from "@db";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "dev";

// Create an express server
const app = express();

// Setup CORS options
const corsOptions = {
  origin: process.env.COMMONS_FRONT_END,
  credentials: true,
};
app.use(cors(corsOptions));

// Create a GraphQL endpoint
const server = new ApolloServer({
  schema: graphQLSchema,
  playground: NODE_ENV === "dev" ? true : false,
});

server.applyMiddleware({ app, path: "/api", cors: false });

// Server launch code
app.listen(serverConfig.SERVER_PORT, () =>
  console.log(
    `Commons App Express GraphQL API now running ...\nServer running in [${NODE_ENV.toUpperCase()}] mode and listening on port ${
      serverConfig.SERVER_PORT
    } ...`,
  ),
);
