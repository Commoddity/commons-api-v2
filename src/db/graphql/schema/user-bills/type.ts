import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

export const UserBill = new GraphQLObjectType({
  name: "UserBill",
  extensions: {
    joinMonster: {
      sqlTable: "user_bills",
      uniqueKey: ["user_id", "bill_id"],
    },
  },
  fields: () => ({
    user_id: { type: GraphQLNonNull(GraphQLString) },
    bill_id: { type: GraphQLNonNull(GraphQLString) },
    created_at: { type: GraphQLDateTime },
  }),
});
