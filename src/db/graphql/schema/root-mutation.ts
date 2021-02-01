import { GraphQLObjectType } from "graphql";
import { userMutations } from "./users";
import { userBillMutations } from "./user-bills";
import { userCategoryMutations } from "./user-categories";

const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...userMutations,
    ...userBillMutations,
    ...userCategoryMutations,
  }),
});

export { RootMutation };
