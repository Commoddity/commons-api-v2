import { GraphQLSchema } from "graphql";

import { RootMutation, RootQuery } from ".";

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export { schema };
