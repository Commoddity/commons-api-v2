import { GraphQLEnumType } from "graphql";

export const NotificationEnumType = new GraphQLEnumType({
  name: "NotificationEnum",
  values: {
    DAILY: {
      value: 0,
    },
    WEEKLY: {
      value: 1,
    },
    BIWEEKLY: {
      value: 2,
    },
    MONTHLY: {
      value: 3,
    },
  },
});
