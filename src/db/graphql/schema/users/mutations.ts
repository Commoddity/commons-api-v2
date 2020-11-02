import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

import { db } from "@config";
import { GraphQLFields } from "@types";

import { NotificationEnumType } from "../../enums";
import { UserType } from "./types";

export const userMutations: GraphQLFields = {
  addUser: {
    type: UserType,
    args: {
      first_name: { type: GraphQLNonNull(GraphQLString) },
      last_name: { type: GraphQLNonNull(GraphQLString) },
      username: { type: GraphQLNonNull(GraphQLString) },
      password: { type: GraphQLNonNull(GraphQLString) },
      email: { type: GraphQLNonNull(GraphQLString) },
      phone_number: { type: GraphQLInt },
      postal_code: { type: GraphQLString },
      email_notification: { type: NotificationEnumType },
      sms_notification: { type: NotificationEnumType },
      active: { type: GraphQLBoolean },
      created_at: { type: GraphQLDateTime },
    },
    resolve: async (_parent, args, _context, _resolveInfo) => {
      try {
        const query = `INSERT INTO users (first_name, last_name, username, email, phone_number, postal_code, email_notification, sms_notification, active, created_at) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, (to_timestamp(${Date.now()} / 1000.0))) 
          RETURNING *`;
        const values = [
          args.first_name,
          args.last_name,
          args.username,
          args.email,
          args.phone_number,
          args.postal_code,
          args.email_notification,
          args.sms_notification,
          true,
        ];
        const response = await db.query(query, values);
        console.log(
          `Successfully added user ${args.first_name} ${args.last_name} to database.`,
        );
        return response[0];
      } catch (err) {
        console.error(`Failed to insert new user. ${err}`);
        throw new Error(`Failed to insert new user. ${err}`);
      }
    },
  },

  deleteUser: {
    type: UserType,
    args: {
      id: { type: GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (_parent, args, _context, _resolveInfo) => {
      try {
        const query = `DELETE FROM users 
                      WHERE (id = $1)`;
        const values = [args.id];
        const response = await db.query(query, values);
        console.log(
          `Successfully deleted user with id ${args.id} from database.`,
        );
        return response[0];
      } catch (err) {
        console.error(`Failed to delete user. ${err}`);
        throw new Error(`Failed to delete user. ${err}`);
      }
    },
  },
};
