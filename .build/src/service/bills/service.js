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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillsService = void 0;
const _services_1 = require("..");
class BillsService extends _services_1.BaseService {
    constructor() {
        super(...arguments);
        this.table = "bills";
    }
    createBill(bill) {
        const _super = Object.create(null, {
            createOne: { get: () => super.createOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.createOne.call(this, { table: this.table, tableValues: bill });
        });
    }
    createManyBills(bills) {
        const _super = Object.create(null, {
            createMany: { get: () => super.createMany }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.createMany.call(this, {
                table: this.table,
                tableValuesArray: bills,
            });
        });
    }
    deleteBill(code) {
        const _super = Object.create(null, {
            deleteOne: { get: () => super.deleteOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.deleteOne.call(this, { table: this.table, where: { code } });
        });
    }
    updateBillPassed({ code, passed }) {
        const _super = Object.create(null, {
            updateOne: { get: () => super.updateOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.updateOne.call(this, {
                table: this.table,
                data: { code, passed },
            });
        });
    }
    updateSummaryUrl({ code, summary_url, }) {
        const _super = Object.create(null, {
            updateOne: { get: () => super.updateOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.updateOne.call(this, {
                table: this.table,
                data: { code, summary_url },
            });
        });
    }
    updateSummaryUrls() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let billsUpdated = 0;
            const billSummaryMaps = yield new _services_1.WebService().getSummaries();
            const whereCondition = billSummaryMaps.map(({ code }) => {
                return { code };
            });
            const billsWithSummaries = yield this.findManyBills(whereCondition, "OR");
            const billsWithNewSummaries = (_a = billsWithSummaries === null || billsWithSummaries === void 0 ? void 0 : billsWithSummaries.filter(({ summary_url }) => !summary_url)) === null || _a === void 0 ? void 0 : _a.map(({ code }) => code);
            if (billsWithNewSummaries.length) {
                const updateData = billSummaryMaps
                    .filter(({ code }) => billsWithNewSummaries.includes(code))
                    .map(({ code, url: summary_url }) => {
                    return { code, summary_url };
                });
                yield this.updateManyBills(updateData);
                billsUpdated = billsWithNewSummaries.length;
            }
            return billsUpdated;
        });
    }
    updateBillCategories({ code, categories, }) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne },
            createJoinTables: { get: () => super.createJoinTables }
        });
        var categories_1, categories_1_1;
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bill = yield _super.findOne.call(this, {
                    table: this.table,
                    where: { code },
                });
                const tableValuesArray = [];
                try {
                    for (categories_1 = __asyncValues(categories); categories_1_1 = yield categories_1.next(), !categories_1_1.done;) {
                        const billCategory = categories_1_1.value;
                        const category = yield new _services_1.CategoriesService().findOneCategory(billCategory);
                        if (!!(bill === null || bill === void 0 ? void 0 : bill.id) && !!(category === null || category === void 0 ? void 0 : category.id)) {
                            tableValuesArray.push({ bill_id: bill.id, category_id: category.id });
                        }
                        else {
                            throw new Error(`Unable to find Bill or Category.`);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (categories_1_1 && !categories_1_1.done && (_a = categories_1.return)) yield _a.call(categories_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                yield _super.createJoinTables.call(this, {
                    table: "bill_categories",
                    tableValuesArray,
                });
                return true;
            }
            catch (err) {
                throw new Error(`[BILL CATEGORY UPDATE ERROR]: ${err}`);
            }
        });
    }
    updateManyBills(data) {
        const _super = Object.create(null, {
            updateMany: { get: () => super.updateMany }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.updateMany.call(this, { table: this.table, data });
        });
    }
    findBill(code) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.findOne.call(this, { table: this.table, where: { code } });
        });
    }
    findManyBills(where, operator) {
        const _super = Object.create(null, {
            findMany: { get: () => super.findMany }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.findMany.call(this, { table: this.table, where, operator });
        });
    }
    gqlFindOneBill(query) {
        const _super = Object.create(null, {
            one: { get: () => super.one }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.one.call(this, query);
        });
    }
    gqlFindManyBills(query) {
        const _super = Object.create(null, {
            many: { get: () => super.many }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.many.call(this, query);
        });
    }
}
exports.BillsService = BillsService;
