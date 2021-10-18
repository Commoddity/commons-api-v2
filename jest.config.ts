import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
  roots: ["<rootDir>/src"],
  collectCoverage: true,
  testTimeout: 500000,
  coverageDirectory: "src/test/coverage",
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

export default config;
