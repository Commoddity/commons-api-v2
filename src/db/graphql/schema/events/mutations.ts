import { GraphQLNonNull, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

import { db } from "@config";

import { EventType } from "./types";
import { DateScalar } from "../../scalars";

export const eventMutations: GraphQLFields = {
  addEvent: {
    type: EventType,
    args: {
      bill_code: { type: GraphQLNonNull(GraphQLString) },
      title: { type: GraphQLNonNull(GraphQLString) },
      publication_date: { type: DateScalar },
      created_at: { type: GraphQLDateTime },
    },
    resolve: async (_parent, args, _context, _resolveInfo) => {
      try {
        const query = `INSERT INTO events (bill_code, title, publication_date, created_at) 
          VALUES ($1, $2, $3, (to_timestamp(${Date.now()} / 1000.0))) 
          RETURNING *`;
        const values = [args.bill_code, args.title, args.publication_date];
        const response = await db.query(query, values);
        console.log(
          `Successfully added event for Bill ${args.bill_code} to database.`,
        );
        return response[0];
      } catch (err) {
        console.error(`Failed to insert new event. ${err}`);
        throw new Error(`Failed to insert new event. ${err}`);
      }
    },
  },
};
