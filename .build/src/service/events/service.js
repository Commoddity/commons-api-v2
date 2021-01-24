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
exports.EventsService = void 0;
const _services_1 = require("@services");
class EventsService extends _services_1.BaseService {
    constructor() {
        super(...arguments);
        this.table = "events";
    }
    createEvent(event) {
        const _super = Object.create(null, {
            createOne: { get: () => super.createOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.createOne.call(this, { table: this.table, tableValues: event });
        });
    }
    createManyEvents(events) {
        const _super = Object.create(null, {
            createMany: { get: () => super.createMany }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.createMany.call(this, {
                table: this.table,
                tableValuesArray: events,
            });
        });
    }
    updateBillsPassedStatus(events) {
        var events_1, events_1_1;
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            let billsUpdated = false;
            try {
                for (events_1 = __asyncValues(events); events_1_1 = yield events_1.next(), !events_1_1.done;) {
                    const event = events_1_1.value;
                    const billHasPassed = !!event.title.includes("Royal Assent");
                    const billHasFailed = !!(event.title.includes("Defeated") ||
                        event.title.includes("Not Proceeded With"));
                    if (billHasPassed) {
                        yield new _services_1.BillsService().updateBillPassed({
                            code: event.bill_code,
                            passed: true,
                        });
                        console.log(`Bill ${event.bill_code} has passed and the DB has been updated ....`);
                        billsUpdated = true;
                    }
                    else if (billHasFailed) {
                        yield new _services_1.BillsService().updateBillPassed({
                            code: event.bill_code,
                            passed: false,
                        });
                        console.log(`Bill ${event.bill_code} has failed and the DB has been updated ....`);
                        billsUpdated = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (events_1_1 && !events_1_1.done && (_a = events_1.return)) yield _a.call(events_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return billsUpdated;
        });
    }
    deleteEvent(bill_code) {
        const _super = Object.create(null, {
            deleteOne: { get: () => super.deleteOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.deleteOne.call(this, { table: this.table, where: { bill_code } });
        });
    }
    gqlFindOneEvent(query) {
        const _super = Object.create(null, {
            one: { get: () => super.one }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.one.call(this, query);
        });
    }
    gqlFindManyEvents(query) {
        const _super = Object.create(null, {
            many: { get: () => super.many }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.many.call(this, query);
        });
    }
}
exports.EventsService = EventsService;
