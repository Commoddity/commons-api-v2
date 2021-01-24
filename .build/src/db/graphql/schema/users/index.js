"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueries = exports.userMutations = void 0;
var mutations_1 = require("./mutations");
Object.defineProperty(exports, "userMutations", { enumerable: true, get: function () { return mutations_1.userMutations; } });
var queries_1 = require("./queries");
Object.defineProperty(exports, "userQueries", { enumerable: true, get: function () { return queries_1.userQueries; } });
__exportStar(require("./type"), exports);
