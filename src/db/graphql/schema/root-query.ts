import { GraphQLObjectType } from "graphql";
import { billQueries } from "./bills";
import { categoryQueries } from "./categories";
import { eventQueries } from "./events";
import { parliamentQueries } from "./parliaments";
import { userQueries } from "./users";

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
