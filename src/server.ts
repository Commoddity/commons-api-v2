// Load in .env variables
import dotenv from "dotenv";

import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";

import { serverConfig } from "@config";
import { schema as graphQLSchema } from "@db";

dotenv.config();

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
  playground: process.env.NODE_ENV === "development" ? true : false,
});

server.applyMiddleware({ app, path: "/api", cors: false });

// Server launch code
app.listen(serverConfig.SERVER_PORT, () =>
  console.log(
    `Commons App Express GraphQL API now running ...\nServer running in ${process.env.NODE_ENV} mode and listening on port ${serverConfig.SERVER_PORT} ...`,
  ),
);
