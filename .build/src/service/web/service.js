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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebService = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const xml2js_1 = require("xml2js");
const _services_1 = require("..");
const bills_1 = require("../bills");
const events_1 = require("../events");
const _utils_1 = require("../../utils");
class WebService extends _services_1.BaseService {
    constructor() {
        super(...arguments);
        this.getLegisInfoCaller = (url) => __awaiter(this, void 0, void 0, function* () {
            try {
                const xml = yield this.fetchXml(url);
                const sourceArray = yield _utils_1.FormatUtils.formatXml(xml);
                return yield this.splitBillsAndEvents(sourceArray);
            }
            catch (error) {
                throw new Error(`[LEGISINFO CALLER ERROR] ${error}`);
            }
        });
        this.getSummaries = () => __awaiter(this, void 0, void 0, function* () {
            const summaryUrl = "https://www.parl.ca/legisinfo/RSSFeed.aspx?download=rss&Language=E&source=LegislativeSummaryPublications";
            try {
                const xml = yield this.fetchXml(summaryUrl);
                const summariesArray = yield _utils_1.FormatUtils.formatXml(xml);
                return this.splitSummaries(summariesArray);
            }
            catch (error) {
                throw new Error(`[SUMMARIES FETCH ERROR] ${error}`);
            }
        });
    }
    fetchXml(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: xml } = yield axios_1.default.get(url);
                return xml;
            }
            catch (error) {
                throw new Error(`[WEB SERVICE ERROR]: fetchXml: ${error}`);
            }
        });
    }
    fetchFullText(fullTextUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(fullTextUrl);
                const fullTextPage = cheerio_1.default.load(response.data);
                const xmlPageLink = fullTextPage('a.btn-export-xml:contains("XML")').attr("href");
                const fullTextUrlJoined = `https://www.parl.ca${xmlPageLink}`;
                const fullTextXml = yield this.fetchXml(fullTextUrlJoined);
                if (fullTextXml) {
                    const fullTextRaw = cheerio_1.default.load(fullTextXml)("text").text();
                    return fullTextRaw;
                }
            }
            catch (error) {
                console.error(`An error occurred while fetching raw full text: ${error}`);
            }
        });
    }
    fetchSummaryUrls(summariesUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.fetchXml(summariesUrl)
                    .then((xml) => {
                    if (xml) {
                        xml2js_1.parseString(xml, (error, response) => {
                            if (!error) {
                                const xmlObject = JSON.parse(JSON.stringify(response));
                                const summariesArray = xmlObject.rss.channel[0].item;
                                summariesArray ? resolve(summariesArray) : resolve([]);
                            }
                            else if (error) {
                                reject(`[WEB SERVICE ERROR - fetchSummaryUrls ] ${error}`);
                            }
                        });
                    }
                    else {
                        reject(`[WEB SERVICE ERROR - fetchSummaryUrls ] Unable to fetch XML for legislative summaries.`);
                    }
                })
                    .catch((error) => {
                    reject(`[WEB SERVICE ERROR - fetchSummaryUrls ] ${error}`);
                });
            });
        });
    }
    splitSummaries(fetchedSummaryArray) {
        const summariesArray = [];
        fetchedSummaryArray.forEach((summary) => {
            if (summary.title.includes("Legislative Summary Published for ")) {
                const summaryBillCode = summary.title
                    .split("Legislative Summary Published for ")[1]
                    .split(",")[0];
                const summaryObject = {
                    code: summaryBillCode,
                    url: summary.link,
                };
                summariesArray.push(summaryObject);
            }
        });
        return summariesArray;
    }
    splitBillsAndEvents(billEventsArray) {
        const _super = Object.create(null, {
            findAllValues: { get: () => super.findAllValues },
            findAll: { get: () => super.findAll }
        });
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const billsArray = [];
            const eventsArray = [];
            const sortedBillEventsArray = this.sortBillEventsByDate(billEventsArray);
            const billCodes = yield _super.findAllValues.call(this, {
                table: "bills",
                column: "code",
            });
            const events = yield _super.findAll.call(this, "events");
            try {
                for (var sortedBillEventsArray_1 = __asyncValues(sortedBillEventsArray), sortedBillEventsArray_1_1; sortedBillEventsArray_1_1 = yield sortedBillEventsArray_1.next(), !sortedBillEventsArray_1_1.done;) {
                    const billEvent = sortedBillEventsArray_1_1.value;
                    const code = _utils_1.FormatUtils.formatCode(billEvent.description);
                    const eventTitle = _utils_1.FormatUtils.formatTitle(billEvent.title);
                    const newBill = !!(!billsArray.some((savedBill) => savedBill.code === code) &&
                        !billCodes.includes(code));
                    if (newBill) {
                        const bill = yield bills_1.createBill(billEvent);
                        billsArray.push(bill);
                        console.log(`[NEW BILL] Successfully fetched Bill ${bill.code} from LEGISinfo server ...`);
                    }
                    const newEvent = !events.some((savedEvent) => savedEvent.bill_code === code && savedEvent.title === eventTitle);
                    if (newEvent) {
                        const event = new events_1.Event(billEvent);
                        eventsArray.push(event);
                        console.log(`[NEW EVENT] Successfully fetched ${event.title} for Bill ${event.bill_code} from LEGISinfo server ...`);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (sortedBillEventsArray_1_1 && !sortedBillEventsArray_1_1.done && (_a = sortedBillEventsArray_1.return)) yield _a.call(sortedBillEventsArray_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return { billsArray, eventsArray };
        });
    }
    sortBillEventsByDate(billEventsArray) {
        return billEventsArray.sort((a, b) => !!(!!a.pubDate && !!b.pubDate) && a.pubDate < b.pubDate ? 1 : -1);
    }
}
exports.WebService = WebService;
