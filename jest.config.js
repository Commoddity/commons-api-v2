const tsconfig = require("./tsconfig.json");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

//eslint-ignore-next
module.exports = {
  verbose: true,
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
  roots: ["<rootDir>/src"],
  collectCoverage: true,
  coverageDirectory: "src/test/coverage",
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper,
};
