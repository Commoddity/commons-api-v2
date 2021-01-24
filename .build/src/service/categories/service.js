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
exports.CategoriesService = void 0;
const _services_1 = require("..");
class CategoriesService extends _services_1.BaseService {
    constructor() {
        super(...arguments);
        this.table = "categories";
    }
    findOneCategory(category) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.findOne.call(this, {
                table: this.table,
                where: { class_code: category },
            });
        });
    }
    gqlFindOneCategory(query) {
        const _super = Object.create(null, {
            one: { get: () => super.one }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.one.call(this, query);
        });
    }
    gqlFindManyCategories(query) {
        const _super = Object.create(null, {
            many: { get: () => super.many }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.many.call(this, query);
        });
    }
}
exports.CategoriesService = CategoriesService;
