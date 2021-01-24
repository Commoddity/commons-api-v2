import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { DateScalar } from "../../scalars";

export const Event: GraphQLObjectType = new GraphQLObjectType({
  name: "Event",
  extensions: {
    joinMonster: {
      sqlTable: "events",
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    bill_code: { type: GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLNonNull(GraphQLString) },
    publication_date: { type: DateScalar },
    created_at: { type: GraphQLDateTime },
  }),
});
