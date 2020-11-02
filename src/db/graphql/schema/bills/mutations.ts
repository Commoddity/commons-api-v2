import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

import { db } from "@config";
import { GraphQLFields } from "@types";

import { DateScalar } from "../../scalars";
import { BillType } from "./types";

export const billMutations: GraphQLFields = {
  addBill: {
    type: BillType,
    args: {
      parliamentary_session_id: { type: GraphQLNonNull(GraphQLInt) },
      code: { type: GraphQLNonNull(GraphQLString) },
      title: { type: GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      introduced_date: { type: DateScalar },
      summary_url: { type: GraphQLString },
      page_url: { type: GraphQLString },
      full_text_url: { type: GraphQLString },
      passed: { type: GraphQLBoolean },
      created_at: { type: GraphQLDateTime },
    },
    resolve: async (_parent, args, _context, _resolveInfo) => {
      try {
        const query = `INSERT INTO bills (parliamentary_session_id, code, title, description, introduced_date, summary_url, page_url, full_text_url, passed, created_at) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, (to_timestamp(${Date.now()} / 1000.0))) 
          RETURNING *`;
        const values = [
          args.parliamentary_session_id,
          args.code,
          args.title,
          args.description,
          args.introduced_date,
          args.summary_url,
          args.page_url,
          args.full_text_url,
          args.passed,
        ];

        const response = await db.query(query, values);
        console.log(`Successfully added Bill ${args.code} to database.`);
        return response[0];
      } catch (err) {
        console.error(`Failed to insert new bill. ${err}`);
        throw new Error(`Failed to insert new bill. ${err}`);
      }
    },
  },
};
