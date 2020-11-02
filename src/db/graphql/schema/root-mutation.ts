import "dotenv/config";
import { GraphQLObjectType } from "graphql";

import {
  billMutations,
  billCategoryMutations,
  eventMutations,
  parliamentMutations,
  userMutations,
  userBillMutations,
  userCategoryMutations,
} from ".";

// RootMutation groups mutations for creating/updating data in the database
const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...billMutations,
    ...billCategoryMutations,
    ...eventMutations,
    ...parliamentMutations,
    ...userMutations,
    ...userBillMutations,
    ...userCategoryMutations,
  }),
});

export { RootMutation };
