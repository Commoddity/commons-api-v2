import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

import { db } from "@config";
import { GraphQLFields } from "@types";

import { DateScalar } from "../../scalars";
import { ParliamentarySessionType, ParliamentType } from "./types";

export const parliamentMutations: GraphQLFields = {
  addParliament: {
    type: ParliamentType,
    args: {
      start_date: { type: DateScalar },
      end_date: { type: DateScalar },
      created_at: { type: GraphQLDateTime },
    },
    resolve: async (_parent, args, _context, _resolveInfo) => {
      try {
        const query = `INSERT INTO parliaments (start_date, end_date, created_at) 
          VALUES ($1, $2, (to_timestamp(${Date.now()} / 1000.0))) 
          RETURNING *`;
        const values = [args.start_date, args.end_date];
        const response = await db.query(query, values);
        console.log(`Successfully added new parliament to database.`);
        return response[0];
      } catch (err) {
        console.error(`Failed to insert new parliament. ${err}`);
        throw new Error(`Failed to insert new parliament. ${err}`);
      }
    },
  },

  addParliamentarySession: {
    type: ParliamentarySessionType,
    args: {
      parliament_id: { type: GraphQLNonNull(GraphQLInt) },
      number: { type: GraphQLNonNull(GraphQLString) },
      start_date: { type: DateScalar },
      end_date: { type: DateScalar },
      created_at: { type: GraphQLDateTime },
    },
    resolve: async (_parent, args, _context, _resolveInfo) => {
      try {
        const query = `INSERT INTO parliamentary_sessions (parliament_id, number, start_date, end_date, created_at) 
          VALUES ($1, $2, $3, $4, (to_timestamp(${Date.now()} / 1000.0))) 
          RETURNING *`;
        const values = [
          args.parliament_id,
          args.number,
          args.start_date,
          args.end_date,
        ];
        const response = await db.query(query, values);
        console.log(
          `Successfully added parliamentary session ${args.number} to database.`,
        );
        return response[0];
      } catch (err) {
        console.error(`Failed to insert new parliamentary_session. ${err}`);
        throw new Error(`Failed to insert new parliamentary_session. ${err}`);
      }
    },
  },
};
