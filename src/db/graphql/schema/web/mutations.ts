import { GraphQLBoolean } from "graphql";

import { WebService } from "@services";

export const webMutations: GraphQLFields = {
  updateBills: {
    type: GraphQLBoolean,
    resolve: async () => new WebService().updateBills(),
  },
};
