import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

import { DateScalar } from "../../scalars";

import { BillType } from "@graphql";

const EventType: GraphQLObjectType = new GraphQLObjectType({
  name: "Event",
  extensions: {
    joinMonster: {
      sqlTable: "events",
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), sqlColumn: "id" },
    bill_code: {
      type: BillType,
      sqlJoin: (eventTable: string, billTable: string) =>
        `${eventTable}.bill_code = ${billTable}.code`,
    },
    title: { type: GraphQLNonNull(GraphQLString), sqlColumn: "title" },
    publication_date: { type: DateScalar, sqlColumn: "publication_date" },
    created_at: { type: GraphQLDateTime, sqlColumn: "created_at" },
  }),
});

export { EventType };
