"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParliamentsService = void 0;
const _services_1 = require("@services");
class ParliamentsService extends _services_1.BaseService {
    queryLatestParliamentarySession() {
        const _super = Object.create(null, {
            findLatestId: { get: () => super.findLatestId }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.findLatestId.call(this, { table: `parliamentary_sessions` });
        });
    }
    gqlFindOneParliament(query) {
        const _super = Object.create(null, {
            one: { get: () => super.one }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.one.call(this, query);
        });
    }
    gqlFindManyParliaments(query) {
        const _super = Object.create(null, {
            many: { get: () => super.many }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.many.call(this, query);
        });
    }
    gqlFindOneParliamentarySession(query) {
        const _super = Object.create(null, {
            one: { get: () => super.one }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.one.call(this, query);
        });
    }
    gqlFindManyParliamentarySessions(query) {
        const _super = Object.create(null, {
            many: { get: () => super.many }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.many.call(this, query);
        });
    }
}
exports.ParliamentsService = ParliamentsService;
