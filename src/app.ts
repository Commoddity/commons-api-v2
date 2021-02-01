import express from "express";
import { graphqlHTTP } from "express-graphql";
import bodyParser from "body-parser";
import cors from "cors";
import { schema as graphQLSchema } from "@db";

const corsOptions = {
  origin: "*",
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
  "/api",
  graphqlHTTP({
    schema: graphQLSchema,
    graphiql: process.env.NODE_ENV === "production" ? false : true,
  }),
);

export { app };
