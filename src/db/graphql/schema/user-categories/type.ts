import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

export const UserCategoryType = new GraphQLObjectType({
  name: "UserCategory",
  extensions: {
    joinMonster: {
      sqlTable: "user_categories",
      uniqueKey: ["user_id", "category_id"],
    },
  },
  fields: () => ({
    user_id: { type: GraphQLNonNull(GraphQLString) },
    category_id: { type: GraphQLNonNull(GraphQLString) },
    created_at: { type: GraphQLDateTime },
  }),
});
