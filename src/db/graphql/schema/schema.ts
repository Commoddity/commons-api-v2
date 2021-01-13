import { GraphQLSchema } from "graphql";
import { RootMutation } from "./root-mutation";
import { RootQuery } from "./root-query";

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export { schema };
