import { GraphQLScalarType } from "graphql";

const isDate = (dateString: string): boolean => {
  return !isNaN(new Date(dateString).getDate());
};

// Custom Scalar type to accomodate either a Date object or undefined
// as certain bills do not have an Introduced Date and will return undefined
const dateOrUndefinedSerialize = (value: string): string | undefined => {
  if (isDate(value)) {
    return new Date(value).toLocaleDateString("en-ZA");
  } else if (value === "undefined") {
    return undefined;
  } else {
    throw new Error("Date scalar must be a valid date string or undefined.");
  }
};

const dateOrUndefinedParseValue = (value: string): string | undefined => {
  if (isDate(value)) {
    return new Date(value).toLocaleDateString("en-ZA");
  } else if (value === "undefined") {
    return undefined;
  } else {
    throw new Error("Date scalar must be a valid date string or undefined.");
  }
};

const dateOrUndefinedParseLiteral = (ast: {
  // eslint-disable-next-line
  [key: string]: any;
}): string | undefined => {
  const { value } = ast;

  if (isDate(value)) {
    return new Date(value).toLocaleDateString("en-ZA");
  } else if (value === "undefined") {
    return undefined;
  } else {
    throw new Error("Date scalar must be a valid date string or undefined.");
  }
};

export const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "A Date string or undefined",
  serialize: dateOrUndefinedSerialize,
  parseValue: dateOrUndefinedParseValue,
  parseLiteral: dateOrUndefinedParseLiteral,
});
