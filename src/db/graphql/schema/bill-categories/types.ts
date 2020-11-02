import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

const BillCategoryType = new GraphQLObjectType({
  name: "BillCategory",
  extensions: {
    joinMonster: {
      sqlTable: "bill_categories",
      uniqueKey: ["bill_id", "category_id"],
    },
  },
  fields: () => ({
    bill_id: { type: GraphQLNonNull(GraphQLString) },
    category_id: { type: GraphQLNonNull(GraphQLString) },
    created_at: { type: GraphQLDateTime },
  }),
});

export { BillCategoryType };
