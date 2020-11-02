import { GraphQLObjectType } from "graphql";

// GraphQL Types
import {
  billQueries,
  categoryQueries,
  eventQueries,
  parliamentQueries,
  userQueries,
} from ".";

//Query Root that uses Join Monster to translate GraphQL queries to SQL
const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    ...billQueries,
    ...categoryQueries,
    ...eventQueries,
    ...parliamentQueries,
    ...userQueries,
  }),
});

export { RootQuery };
