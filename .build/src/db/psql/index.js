"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = exports.sql = exports.pgp = exports.db = void 0;
var postgres_config_1 = require("./postgres.config");
Object.defineProperty(exports, "db", { enumerable: true, get: function () { return postgres_config_1.db; } });
Object.defineProperty(exports, "pgp", { enumerable: true, get: function () { return postgres_config_1.pgp; } });
Object.defineProperty(exports, "sql", { enumerable: true, get: function () { return postgres_config_1.sql; } });
Object.defineProperty(exports, "getConnection", { enumerable: true, get: function () { return postgres_config_1.getConnection; } });
