import dotenv from "dotenv";
import path from "path";
const dotenvPath = path.join(__dirname, "../", `.env.${process.env.NODE_ENV}`);
dotenv.config({
  path: dotenvPath,
});

import { ApolloServer } from "apollo-server-lambda";
import { schema as graphQLSchema } from "./db";

const server = new ApolloServer({
  schema: graphQLSchema,
  playground: {
    endpoint: "/dev/graphql",
  },
});

exports.graphqlHandler = server.createHandler();
