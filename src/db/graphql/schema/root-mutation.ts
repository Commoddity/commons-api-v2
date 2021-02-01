import { GraphQLObjectType } from "graphql";
import { userMutations } from "./users";
import { userBillMutations } from "./user-bills";
import { userCategoryMutations } from "./user-categories";
import { webMutations } from "./web";

const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...userMutations,
    ...userBillMutations,
    ...userCategoryMutations,
    ...webMutations,
  }),
});

export { RootMutation };
